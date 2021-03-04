import supertest from "supertest";
import { Digipet, setDigipet } from "../digipet/model";
import app from "../server";

/**
 * This file has integration tests for ignoring a digipet.
 *
 * It is intended to test one behaviour:
 *
 *  1. Ignoring a digipet leads to decreasing all stats until a floor of 0
 *
 */

describe("When a user ignores a digipet repeatedly, its happiness decreases by 10 each time until it eventually floors out at 0", () => {
    beforeAll(() => {
        // setup: give an initial digipet
        const startingDigipet: Digipet = {
            happiness: 30,
            nutrition: 30,
            discipline: 30,
        };
        setDigipet(startingDigipet);
    });

    test("GET /digipet informs them that they have a digipet with starting stats", async () => {
        const response = await supertest(app).get("/digipet");
        expect(response.body.message).toMatch(/your digipet/i);
        expect(response.body.digipet).toHaveProperty("happiness", 30);
    });

    test("1st GET /digipet/ignore informs them about the ignore and shows decreased happiness", async () => {
        const response = await supertest(app).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("happiness", 20);
    });

    test("2nd GET /digipet/ignore shows continued stats change", async () => {
        const response = await supertest(app).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("happiness", 10);
    });

    test("3rd GET /digipet/ignore shows happiness hitting a floor of 0", async () => {
        const response = await supertest(app).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("happiness", 0);
    });

    test("4th GET /digipet/ignore shows no further decrease in happiness", async () => {
        const response = await supertest(app).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("happiness", 0);
    });
});