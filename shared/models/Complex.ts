export class Complex {
  location: {
    "type": string,
    "coordinates": number[]
  };
  description: string;
  admin: string;
  managers: string[];
  name: string;
  logo: string;
  contacts: {
    title: string,
    value: string,
    id: string
  }[];
  id: string;

  constructor() {
    this.location = {type: '', coordinates: []};
    this.description = '';
    this.admin = '';
    this.managers = [];
    this.name = '';
    this.logo = '';
    this.contacts = [];
    this.id = '';
  }
}
