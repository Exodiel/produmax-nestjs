export class UserDTO {
    ci: string;
    name: string;
    lastname: string;
    birthdate: string;
    email: string;
    password: string;
    phone: string;
    rolId: number;
    imageId: number;
}

// tslint:disable-next-line: max-classes-per-file
export class UserRO {
    email: string;
    password: string;
}

// tslint:disable-next-line: max-classes-per-file
export class UserR {
    ci: string;
    name: string;
    lastname: string;
    birthdate: string;
    email: string;
    password: string;
    phone: string;
}
