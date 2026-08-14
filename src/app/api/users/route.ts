import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// POST only — additive persistence for the register flow. Called alongside
// (not instead of) the existing client-side login(); does not replace or
// touch auth/session logic anywhere.
export async function POST(req: NextRequest) {
  const body = await req.json();
  const id = body.email || body.id;
  if (!id) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  const row = {
    id,
    name: body.name ?? null,
    company: body.company ?? null,
    role: body.role ?? null,
    email: body.email ?? id,
    phone: body.phone ?? null,
    designation: body.designation ?? null,
    department: body.department ?? null,
    companyType: body.companyType ?? null,
    businessType: body.businessType ?? null,
    gstin: body.gstin ?? null,
    yearEstablished: body.yearEstablished ?? null,
    employeeRange: body.employeeRange ?? null,
    memberSince: body.memberSince ?? null,
    onboarded: body.onboarded ? 1 : 0,
  };

  try {
    db.prepare(
      `INSERT INTO users
        (id, name, company, role, email, phone, designation, department, companyType,
         businessType, gstin, yearEstablished, employeeRange, memberSince, onboarded)
       VALUES
        (@id, @name, @company, @role, @email, @phone, @designation, @department, @companyType,
         @businessType, @gstin, @yearEstablished, @employeeRange, @memberSince, @onboarded)
       ON CONFLICT(id) DO UPDATE SET
        name=@name, company=@company, role=@role, phone=@phone, designation=@designation,
        department=@department, companyType=@companyType, businessType=@businessType,
        gstin=@gstin, yearEstablished=@yearEstablished, employeeRange=@employeeRange,
        memberSince=@memberSince, onboarded=@onboarded`
    ).run(row);
  } catch (err) {
    console.error("POST /api/users failed:", err);
    return NextResponse.json({ error: "Failed to save user" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
