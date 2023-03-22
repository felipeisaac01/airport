enum federativeUnits {
    BA,
    SP,
    RJ,
    MG,
    RN,
    RS,
  }

interface Base {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

interface ICity extends Base {
    name: string;
    federativeUnit: federativeUnits
}

interface IAirport extends Base {
    cityId: string;
    city: ICity;
    name: string;
    iataCode: string
}