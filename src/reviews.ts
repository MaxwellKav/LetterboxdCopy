
import { v4 as uuidv4 } from'uuid';

type Review = {
    name: string
    description: string;
    rating: number;
    favorite: boolean;
};

type ReviewDict = Readonly<Record<string, Review>>;

class Reviews {
    protected static instanceCounter = 1;
    readonly reviews: ReviewDict;
    readonly uuid;

    constructor(init?: ReviewDict, uuid ?: string) {
        this.reviews = init ?? {};
        this.uuid = uuid ?? uuidv4();
    }   

    add(name: string, ReviewInfo: Review): Reviews {
        return new Reviews({
            ...this.reviews,
            [name]: ReviewInfo
        },
        this.uuid
    );
    }

    remove(name: string): Reviews {
        return new Reviews(
        Object.fromEntries
        (Object.entries(this.reviews)
        .filter(([key])=> key !== name),),
        this.uuid,
        );
    }
}


export { Reviews }