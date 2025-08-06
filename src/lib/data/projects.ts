export interface Testimonial {
  quote: string;
  name: string;
}

export interface Project {
  slug: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  mainImage: string;
  caption: string;
  gallery?: string[];
  testimonials?: Testimonial[];
  featured?: boolean;
}

export interface SmallProject {
  title: string;
  subtitle: string;
  src: string;
  sublink: string;
}
