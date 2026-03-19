"use client"

import { usePermissions } from "@/hooks/usePermissions"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, ReactNode } from "react"

interface PermissionGuardProps {
    permission?: string
    permissions?: string[]
    requireAny?: boolean
    children: ReactNode
    fallbackUrl?: string
}

/**
 * PermissionGuard component to protect routes/sections
 * @param permission - Single permission string required
 * @param permissions - Array of permission strings
 * @param requireAny - If true, any of the permissions in the array is enough (default: true if permissions array provided)
 * @param children - Content to show if authorized
 * @param fallbackUrl - URL to redirect to if unauthorized (default: /panel)
 */
export const PermissionGuard = ({
    permission,
    permissions,
    requireAny = true,
    children,
    fallbackUrl = "/panel"
}: PermissionGuardProps) => {
    const { hasPermission, hasAnyPermission, isAdmin, isProvider, isLoading } = usePermissions()
    const router = useRouter()

    const isAuthorized = useMemo(() => {
        if (isLoading) return true; // Don't block while loading

        if (isAdmin || isProvider) return true;

        if (permission) {
            return hasPermission(permission);
        }

        if (permissions) {
            if (requireAny) {
                return hasAnyPermission(permissions);
            } else {
                return permissions.every(p => hasPermission(p));
            }
        }

        return true;
    }, [isLoading, isAdmin, isProvider, hasPermission, hasAnyPermission, permission, permissions, requireAny]);

    useEffect(() => {
        if (!isLoading && !isAuthorized) {
            router.push(fallbackUrl);
        }
    }, [isAuthorized, isLoading, router, fallbackUrl]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return <>{children}</>;
};
