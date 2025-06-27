export type Feature = {
    feature: string,
    amount: string,
    ending: string
}

export type UserItem = {
    _id: string,
    itemId: string,
    userId: string,
    boughtAt: string
}

export type RestaurantItem = {
    _id: string,
    name: string,
    image: string[],
    type: string,
    price: number,
    level: number,
    maxLevel: number,
    features: Feature[]
}

export type Restaurant = {
    _id: string,
    level: number,
    stats: Feature[],
    images: string[],
    userId: string
}