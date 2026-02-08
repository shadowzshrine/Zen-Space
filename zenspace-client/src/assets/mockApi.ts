import type { UserData, FoodEntry, ActivityEntry, FormData } from "../types";
import { dummyFoodLogs, dummyActivityLogs } from "../assets/assets";

interface DB {
    user: any;
    foodLogs: FoodEntry[];
    activityLogs: ActivityEntry[];
}

const getDB = (): DB => {
    const dbStr = localStorage.getItem('fitness_db');
    if (!dbStr) {
        const initialDB: DB = {
            user: null,
            foodLogs: [],
            activityLogs: [],
        };
        return initialDB;
    }
    return JSON.parse(dbStr);
};

const saveDB = (db: DB) => {
    localStorage.setItem('fitness_db', JSON.stringify(db));
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockApi = {
    auth: {
        login: async (credentials: any) => {
            await delay(500);
            const db = getDB();

            // Strict validation: Check if user exists and email matches
            if (!db.user || db.user.email !== credentials.email) {
                throw new Error("Invalid credentials or user not found");
            }

            // Note: In a real app, we'd check password too, but here we just check email existence

            return {
                data: {
                    user: db.user,
                    jwt: "mock_jwt_token_" + Date.now(),
                },
            };
        },
        register: async (credentials: any) => {
            await delay(500);
            const db = getDB();

            // Check if user already exists
            if (db.user) {
                // For this mock demo, maybe we imply overwrite or error? 
                // User said "login panna username already present illatee ulla poga koodathu" 
                // implies unique users. But for a single-user mock db, we overwrite.
            }

            db.user = {
                id: "user_" + Date.now(),
                username: credentials.username,
                email: credentials.email,
                age: 0,
                weight: 0,
                height: 0,
                goal: "maintain",
                dailyCalorieIntake: 2000,
                dailyCalorieBurn: 400,
                createdAt: new Date().toISOString(),
            };
            // Reset logs for new user (but populate with dummy data for demo/tutorial purposes)
            db.foodLogs = [...dummyFoodLogs];
            db.activityLogs = [...dummyActivityLogs];
            saveDB(db);

            return {
                data: {
                    user: db.user,
                    jwt: "mock_jwt_token_" + Date.now(),
                },
            };
        }
    },
    user: {
        me: async () => {
            await delay(300);
            const db = getDB();
            // Wrap in { user: ... } to match AppContext expectation
            return { data: { user: db.user || null } };
        },
        update: async (_id: string, updates: Partial<UserData>) => {
            await delay(300);
            const db = getDB();
            if (db.user) {
                db.user = { ...db.user, ...updates };
                saveDB(db);
            }
            return { data: db.user };
        },
    },
    foodLogs: {
        list: async () => {
            await delay(300);
            const db = getDB();
            return { data: db.foodLogs };
        },
        create: async (payload: { data: FormData | any }) => {
            await delay(300);
            const db = getDB();
            const newEntry: FoodEntry = {
                id: Date.now(),
                documentId: "doc_food_" + Date.now(),
                name: payload.data.name,
                calories: payload.data.calories,
                mealType: payload.data.mealType,
                date: new Date().toISOString().split("T")[0],
                createdAt: new Date().toISOString(),
            };
            db.foodLogs.push(newEntry);
            saveDB(db);
            return { data: newEntry };
        },
        delete: async (documentId: string) => {
            await delay(300);
            const db = getDB();
            db.foodLogs = db.foodLogs.filter(f => f.documentId !== documentId);
            saveDB(db);
            return { data: { id: documentId } };
        }
    },
    activityLogs: {
        list: async () => {
            await delay(300);
            const db = getDB();
            return { data: db.activityLogs };
        },
        create: async (payload: { data: { name: string; duration: number; calories: number } }) => {
            await delay(300);
            const db = getDB();
            const newEntry: ActivityEntry = {
                id: Date.now(),
                documentId: "doc_act_" + Date.now(),
                name: payload.data.name,
                duration: payload.data.duration,
                calories: payload.data.calories,
                date: new Date().toISOString().split("T")[0],
                createdAt: new Date().toISOString(),
            };
            db.activityLogs.push(newEntry);
            saveDB(db);
            return { data: newEntry };
        },
        delete: async (documentId: string) => {
            await delay(300);
            const db = getDB();
            db.activityLogs = db.activityLogs.filter(a => a.documentId !== documentId);
            saveDB(db);
            return { data: { id: documentId } };
        }
    },
    imageAnalysis: {
        analyze: async (_formData: any) => {
            await delay(1500);
            const foods = [
                { name: "Apple", calories: 95 },
                { name: "Banana", calories: 105 },
                { name: "Avocado Toast", calories: 250 },
                { name: "Pizza Slice", calories: 300 },
            ];
            const randomFood = foods[Math.floor(Math.random() * foods.length)];
            return {
                data: {
                    result: randomFood
                }
            };
        }
    }
};

export default mockApi;
