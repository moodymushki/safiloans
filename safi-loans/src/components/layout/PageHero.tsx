interface PageHeroProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  caption?: string;
  imagePosition?: string;
}

const PageHero = ({
  title,
  subtitle,
  imageUrl,
  caption,
  imagePosition = "center",
}: PageHeroProps) => (
  <section className="relative overflow-hidden bg-safi-blue-dark text-primary-foreground">
    <div
      className="absolute inset-0 bg-cover"
      style={{ backgroundImage: `url(${imageUrl})`, backgroundPosition: imagePosition }}
    />
    <div className="absolute inset-0 bg-gradient-to-br from-safi-blue-dark/95 via-primary/85 to-safi-blue-dark/65" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(160,45%,40%,0.18),transparent_52%)]" />
    <div className="container relative flex min-h-[240px] items-center justify-center py-12 md:min-h-[260px] md:py-14">
      <div className="max-w-2xl space-y-4 animate-fade-in text-center md:text-center">
        <h1 className="text-4xl font-heading font-extrabold leading-tight md:text-5xl">{title}</h1>
        <p className="mx-auto max-w-lg text-base leading-relaxed opacity-85 md:text-lg">{subtitle}</p>
        {caption ? (
          <p className="inline-flex rounded-full border border-primary-foreground/20 bg-primary-foreground/15 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            {caption}
          </p>
        ) : null}
      </div>
    </div>
  </section>
);

export default PageHero;
