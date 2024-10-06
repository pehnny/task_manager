import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export const rl = createInterface({input, output});

export const saveFile = "./saves/tasklist.json";
