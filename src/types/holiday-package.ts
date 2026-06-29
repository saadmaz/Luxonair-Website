export type HolidayPackage = {
  id: string;
  title: string;
  holidayTypeSlug: string;
  country: string;
  badge: string;
  nights: number;
  days: number;
  fromPrice: number;
  image: string;
  experiences: string[];
  inclusions: string[];
};
