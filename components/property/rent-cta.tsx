import Link from "next/link";

import { RentRequestDialog } from "@/components/property/rent-request-dialog";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/service/getMe";
import type { PropertyDetail } from "@/lib/types";

export async function RentCta({ property }: { property: PropertyDetail }) {
  const user = await getCurrentUser();

  // ── The property is not available for rent ──
  if (property.status !== "AVAILABLE") {
    return (
      <Button size="lg" className="mt-6 w-full" disabled>
        Not available
      </Button>
    );
  }

  // ── Not signed in ──
  if (!user) {
    return (
      <>
        <Button
          size="lg"
          className="mt-6 w-full"
          render={
            <Link href={`/login?redirect=/properties/${property.id}`} />
          }
        >
          Sign in to request
        </Button>

        <p className="mt-2.5 text-center text-[10px] text-muted-foreground">
          You need a tenant account to send a rental request.
        </p>
      </>
    );
  }

  // ── Own property ──
  if (user.id === property.landlordId) {
    return (
      <Button size="lg" className="mt-6 w-full" disabled>
        This is your listing
      </Button>
    );
  }

  // ── Only tenants can send requests ──
  if (user.role !== "TENANT") {
    return (
      <>
        <Button size="lg" className="mt-6 w-full" disabled>
          Tenants only
        </Button>

        <p className="mt-2.5 text-center text-[10px] text-muted-foreground">
          You are signed in as a {user.role.toLowerCase()}.
        </p>
      </>
    );
  }

  return (
    <>
      <RentRequestDialog
        propertyId={property.id}
        propertyTitle={property.title}
        monthlyRent={property.monthlyRent}
      />

      <p className="mt-2.5 text-center text-[10px] text-muted-foreground">
        No charge until the landlord approves.
      </p>
    </>
  );
}
