import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

interface PlaceholderPageProps {
  pageId: string;
}

const placeholderContent: Record<string, { title: string; description: string }> = {
  pricing: {
    title: "Pricing",
    description: "Our competitive pricing plans for students and tutors."
  },
  about: {
    title: "About Us",
    description: "Learn more about our mission and values."
  },
  careers: {
    title: "Careers",
    description: "Join our team and help shape the future of education."
  },
  blog: {
    title: "Blog",
    description: "Latest news, updates, and educational resources."
  }
};

const PlaceholderPage = ({ pageId }: PlaceholderPageProps) => {
  const content = placeholderContent[pageId];

  return (
    <div className="container-custom py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{content.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">{content.title}</h1>
        <p className="text-lg text-gray-600">{content.description}</p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
