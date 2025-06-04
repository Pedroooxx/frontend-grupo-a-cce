import { DashboardContent } from "./_components/DashboardContent";
import { DashboardLayout } from "./_components/DashboardLayout";

const DashboardPage = () => {
  return (
    <DashboardLayout
      title="DASHBOARD"
      subtitle="PRINCIPAL"
      breadcrumbs={[{ label: "DASHBOARD" }]}
    >
      <DashboardContent />
    </DashboardLayout>
  );
};

export default DashboardPage;
