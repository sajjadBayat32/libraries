export class Complex {
  id: string;
  managers: string[];
  description: string;
  name: string;
  logo: string;
  location: {
    "type": string,
    "coordinates": number[]
  };
  contacts: {
    title: string,
    value: string,
    id: string
  }[];

  constructor(item: any) {
    this.location = item.location;
    this.description = item.description;
    this.managers = item.managers;
    this.name = item.name;
    this.logo = item.logo;
    this.contacts = item.contacts;
    this.id = item.id;
  }
}
