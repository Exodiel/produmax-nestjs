export class UserDTO {
    ci: string;
    name: string;
    lastname: string;
    age: number;
    email: string;
    password: string;
    phone: string;
    rolId: number;
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
    age: number;
    email: string;
    password: string;
    phone: string;
}

// tslint:disable-next-line:max-classes-per-file
export class UserUp {
    ci: string;
    name: string;
    lastname: string;
    age: number;
    email: string;
    phone: string;
}
