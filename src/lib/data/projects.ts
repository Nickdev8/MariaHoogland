export interface Testimonial {
  quote: string;
  name: string;
}

export interface Project {
  slug: string;
  category: string;
  title: string;
  subtitle: string;
  description: string; // This will now be the Markdown content
  mainImage: string;
  caption: string;
  gallery?: string[];
  testimonials?: Testimonial[];
  featured?: boolean; // Added for mainProjects filtering
}

export interface SmallProject {
  title: string;
  subtitle: string;
  src: string;
  sublink: string;
}
