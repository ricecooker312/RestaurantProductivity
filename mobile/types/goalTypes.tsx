export type Goal = {
    _id: string,
    title: string,
    description: string,
    completed: boolean,
    type: string,
    priority: string,
    difficulty: string,
    userId: string,
    time: string,
    lastUpdated?: string
}