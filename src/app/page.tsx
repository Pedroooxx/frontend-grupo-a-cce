import Link from "next/link";

export default function Page() {
  return (
    <>
      <h1 className="my-4 text-red content container mx-auto">Home!</h1>
      <Link href="dashboard">
        <button>
          <span>Dashboard</span>
        </button>
      </Link>
    </>
  );
}
