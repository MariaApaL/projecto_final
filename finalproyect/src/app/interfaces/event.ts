export interface Event {
        _id:         string;
        name:        string;
        categories:  any[];
        date:        Date;
        location:    string;
        price:       number;
        author:      string;
        plazas:      any[];
        numPlazas:   number;
        description: string;
        comments:    any[];
}
