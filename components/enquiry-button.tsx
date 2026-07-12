type EnquiryButtonProps = {
  title?: string;
};

const DEFAULT_EMAIL = "peadarjb@gmail.com";

export function EnquiryButton({ title }: EnquiryButtonProps) {
  const targetEmail = process.env.NEXT_PUBLIC_ENQUIRY_EMAIL ?? DEFAULT_EMAIL;
  const subject = title ? `Artwork enquiry: ${title}` : "Artwork enquiry";
  const href = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}`;

  return (
    <a className="btn btn-primary" href={href}>
      Make an enquiry
    </a>
  );
}
