import { UsersInterface } from "./user";

export interface EventsInterface {
        _id:         string;
        name:        string;
        category:  string;
        date:        Date;
        location:    string;
        price:       number;
        author:      UsersInterface;
        plazas:      string[];
        numPlazas:   number;
        isFavorite:  boolean;
        description: string;
        comments:    any[];
        createdAt:   Date;
        updatedAt:   Date;
        __v:         number;
        picture:     string;
    }