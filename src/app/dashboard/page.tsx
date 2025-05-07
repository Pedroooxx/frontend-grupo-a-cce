import Link from "next/link";

export default function Dashboard() {
  return (
    <>
      <h1 className="my-4 text-red content container mx-auto">Dashboard!</h1>
      <Link href="/">
        <button>
          <span>Voltar</span>
        </button>
      </Link>
    </>
  );
}
