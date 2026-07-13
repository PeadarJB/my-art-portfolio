import { buildEnquiryHref } from "@/lib/enquiry";

type EnquiryButtonProps = {
  title?: string;
};

export function EnquiryButton({ title }: EnquiryButtonProps) {
  return (
    <a className="btn btn-primary" href={buildEnquiryHref(title)}>
      Make an enquiry
    </a>
  );
}
