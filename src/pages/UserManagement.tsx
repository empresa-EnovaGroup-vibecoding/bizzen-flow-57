import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole, AppRole } from "@/hooks/useUserRole";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Shield, Users, UserCog, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UserWithRole {
  id: string;
  email: string;
  full_name: string | null;
  role: AppRole | null;
  role_id: string | null;
  created_at: string;
}

export default function UserManagement() {
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      toast.error("No tienes permiso para acceder a esta página");
      navigate("/");
    }
  }, [isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, full_name, created_at");

      if (profilesError) throw profilesError;

      // Fetch all roles (admin can see all)
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("id, user_id, role");

      if (rolesError) throw rolesError;

      // Combine data - we need to get emails from auth, but we can't directly
      // So we'll use the profile's user_id and show what we have
      const combinedUsers: UserWithRole[] = (profiles || []).map((profile) => {
        const userRole = roles?.find((r) => r.user_id === profile.user_id);
        return {
          id: profile.user_id,
          email: profile.user_id, // We'll need to improve this
          full_name: profile.full_name,
          role: userRole?.role as AppRole | null,
          role_id: userRole?.id || null,
          created_at: profile.created_at,
        };
      });

      // Also add users with roles but no profile
      roles?.forEach((role) => {
        if (!combinedUsers.find((u) => u.id === role.user_id)) {
          combinedUsers.push({
            id: role.user_id,
            email: role.user_id,
            full_name: null,
            role: role.role as AppRole,
            role_id: role.id,
            created_at: new Date().toISOString(),
          });
        }
      });

      setUsers(combinedUsers);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async (userId: string, role: AppRole) => {
    setUpdating(userId);
    try {
      const existingUser = users.find((u) => u.id === userId);

      if (existingUser?.role_id) {
        // Update existing role
        const { error } = await supabase
          .from("user_roles")
          .update({ role })
          .eq("id", existingUser.role_id);

        if (error) throw error;
      } else {
        // Insert new role
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role });

        if (error) throw error;
      }

      toast.success(`Rol actualizado a ${role === "admin" ? "Administrador" : "Staff"}`);
      fetchUsers();
    } catch (error: any) {
      console.error("Error assigning role:", error);
      toast.error(error.message || "Error al asignar rol");
    } finally {
      setUpdating(null);
    }
  };

  const removeRole = async (userId: string, roleId: string) => {
    setUpdating(userId);
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("id", roleId);

      if (error) throw error;

      toast.success("Rol eliminado");
      fetchUsers();
    } catch (error: any) {
      console.error("Error removing role:", error);
      toast.error(error.message || "Error al eliminar rol");
    } finally {
      setUpdating(null);
    }
  };

  const getRoleBadge = (role: AppRole | null) => {
    if (!role) {
      return <Badge variant="outline" className="text-muted-foreground">Sin rol</Badge>;
    }
    if (role === "admin") {
      return (
        <Badge className="bg-primary text-primary-foreground">
          <Shield className="mr-1 h-3 w-3" />
          Administrador
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        <Users className="mr-1 h-3 w-3" />
        Staff
      </Badge>
    );
  };

  if (roleLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const adminsCount = users.filter((u) => u.role === "admin").length;
  const staffCount = users.filter((u) => u.role === "staff").length;
  const pendingCount = users.filter((u) => !u.role).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <UserCog className="h-8 w-8" />
          Gestión de Usuarios
        </h1>
        <p className="text-muted-foreground mt-1">
          Administra los roles y permisos de los usuarios del sistema
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <UserCog className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios Registrados</CardTitle>
          <CardDescription>
            Asigna roles a los usuarios para controlar su acceso al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay usuarios registrados aún
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol Actual</TableHead>
                  <TableHead>Fecha de Registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {user.full_name || "Sin nombre"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          ID: {user.id.slice(0, 8)}...
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString("es-ES")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Select
                          value={user.role || "none"}
                          onValueChange={(value) => {
                            if (value !== "none") {
                              assignRole(user.id, value as AppRole);
                            }
                          }}
                          disabled={updating === user.id}
                        >
                          <SelectTrigger className="w-[140px]">
                            {updating === user.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <SelectValue placeholder="Asignar rol" />
                            )}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none" disabled>
                              Seleccionar rol
                            </SelectItem>
                            <SelectItem value="admin">
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Administrador
                              </div>
                            </SelectItem>
                            <SelectItem value="staff">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Staff
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        {user.role_id && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                disabled={updating === user.id}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  ¿Eliminar rol de usuario?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  El usuario perderá todo acceso al sistema hasta que se le asigne un nuevo rol.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => removeRole(user.id, user.role_id!)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Eliminar rol
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Permissions Info */}
      <Card>
        <CardHeader>
          <CardTitle>Permisos por Rol</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-semibold">Administrador</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 ml-7">
                <li>✓ Acceso completo a todas las funciones</li>
                <li>✓ Gestión de usuarios y roles</li>
                <li>✓ CRUD completo en inventario y servicios</li>
                <li>✓ Eliminación de registros</li>
                <li>✓ Acceso a reportes</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Staff</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 ml-7">
                <li>✓ Gestión de clientes y citas</li>
                <li>✓ Registro de ventas (POS)</li>
                <li>✓ Evaluaciones faciales</li>
                <li>○ Solo lectura en inventario</li>
                <li>○ Solo lectura en servicios</li>
                <li>✗ Sin acceso a eliminación</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
