import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';
import { PrismaClient } from "../generated/prisma/client.js";

dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in environment variables');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const checkDatabaseConnection = async () => {
    try {
        await prisma.$connect();
        logger.info('Database connection established successfully.');
    } catch (error:any) {
        logger.error(error.message)
        logger.error('Unable to connect to the database:');
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
};

export {prisma, checkDatabaseConnection};