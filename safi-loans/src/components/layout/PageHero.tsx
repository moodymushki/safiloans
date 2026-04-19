interface PageHeroProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
  caption?: string;
  imagePosition?: string;
}

const PageHero = ({
  title,
  subtitle,
  imageUrl,
  imageAlt,
  caption,
  imagePosition = "center",
}: PageHeroProps) => (
  <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-safi-blue-dark text-primary-foreground">
    <div
      className="absolute inset-0 bg-cover lg:hidden"
      style={{ backgroundImage: `url(${imageUrl})`, backgroundPosition: imagePosition }}
    />
    <div className="absolute inset-0 bg-gradient-to-br from-safi-blue-dark/95 via-primary/88 to-primary/72 lg:hidden" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(160,45%,40%,0.16),transparent_50%)]" />
    <div className="container relative grid items-center gap-10 py-16 md:py-20 lg:min-h-[430px] lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.75fr)]">
      <div className="mx-auto max-w-2xl space-y-4 text-center animate-fade-in lg:mx-0 lg:text-left">
        <h1 className="text-4xl font-heading font-extrabold leading-tight md:text-5xl">{title}</h1>
        <p className="mx-auto max-w-lg text-base leading-relaxed opacity-85 md:text-lg lg:mx-0">{subtitle}</p>
      </div>

      <div className="relative hidden animate-fade-in-right lg:block">
        <div className="absolute -left-8 top-10 h-24 w-24 rounded-full bg-secondary/25 blur-2xl" />
        <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-primary-foreground/15 blur-3xl" />
        <div className="relative overflow-hidden rounded-[2rem] border border-primary-foreground/20 bg-primary-foreground/10 p-3 shadow-2xl shadow-safi-blue-dark/35 backdrop-blur">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="h-[300px] w-full rounded-[1.5rem] object-cover"
            style={{ objectPosition: imagePosition }}
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-3 rounded-[1.5rem] bg-gradient-to-t from-safi-blue-dark/45 via-transparent to-primary/10" />
          {caption ? (
            <div className="absolute bottom-7 left-7 rounded-2xl border border-primary-foreground/20 bg-safi-blue-dark/75 px-5 py-4 shadow-xl backdrop-blur-md">
              <p className="font-heading text-xl font-bold">{caption}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  </section>
);

export default PageHero;
