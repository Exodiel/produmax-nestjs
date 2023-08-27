export class UserDTO {
    identification: string;
    identificationType: string;
    name: string;
    lastname: string;
    birthdate: string;
    email: string;
    password: string;
    phone: string;
    imageUrl: string;
}

// tslint:disable-next-line: max-classes-per-file
export class UserRO {
    email: string;
    password: string;
}

// tslint:disable-next-line: max-classes-per-file
export class UserR {
    identification: string;
    identificationType: string;
    name: string;
    lastname: string;
    birthdate: string;
    email: string;
    password: string;
    phone: string;
}
