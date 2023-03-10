import mongoose from 'mongoose';
import * as mongodb from 'mongodb';
import { TypedEmitter } from 'tiny-typed-emitter';

interface CollectionInterface<T = unknown> {
    ID: string;
    data: T;
    createdAt: Date;
    updatedAt: Date;
    expireAt?: Date;
}
declare const docSchema: mongoose.Schema<CollectionInterface<unknown>, mongoose.Model<CollectionInterface<unknown>, any, any, any, any>, {}, {}, {}, {}, "type", CollectionInterface<unknown>>;

interface QuickMongoOptions extends mongoose.ConnectOptions {
    /**
     * Collection name to use
     */
    collectionName?: string;
    /**
     * If it should be created as a child db
     */
    child?: boolean;
    /**
     * Parent db
     */
    parent?: Database;
    /**
     * If it should share connection from parent db
     */
    shareConnectionFromParent?: boolean;
    /**
     * If it should connect automatically
     */
    autoConnect?: boolean;
}
interface AllQueryOptions<T = unknown> {
    /**
     * The query limit
     */
    limit?: number;
    /**
     * Sort by
     */
    sort?: string;
    /**
     * Query filter
     */
    filter?: (data: AllData<T>) => boolean;
}
interface AllData<T = unknown> {
    /**
     * The id
     */
    ID: string;
    /**
     * The data associated with a particular ID
     */
    data: T;
}
declare type DocType<T = unknown> = mongoose.Document<any, any, CollectionInterface<T>> & CollectionInterface<T> & {
    _id: mongoose.Types.ObjectId;
};
interface QmEvents<V = unknown> {
    /**
     * The `ready` event
     */
    ready: (db: Database<V>) => unknown;
    /**
     * The `connecting` event
     */
    connecting: () => unknown;
    /**
     * The `connected` event
     */
    connected: () => unknown;
    /**
     * The `open` event
     */
    open: () => unknown;
    /**
     * The `disconnecting` event
     */
    disconnecting: () => unknown;
    /**
     * The `disconnected` event
     */
    disconnected: () => unknown;
    /**
     * The `close` event
     */
    close: () => unknown;
    /**
     * The `reconnected` event
     */
    reconnected: () => unknown;
    /**
     * The `error` event
     */
    error: (error: Error) => unknown;
    /**
     * The `fullsetup` event
     */
    fullsetup: () => unknown;
    /**
     * The `all` event
     */
    all: () => unknown;
    /**
     * The `reconnectFailed` event
     */
    reconnectFailed: () => unknown;
}
/**
 * The Database constructor
 * @extends {EventEmitter}
 */
declare class Database<T = unknown, PAR = unknown> extends TypedEmitter<QmEvents<T>> {
    url: string;
    options: QuickMongoOptions;
    connection: mongoose.Connection;
    parent: Database<PAR>;
    private __child__;
    model: mongoose.Model<CollectionInterface<T>, {}, {}, {}>;
    /**
     * Creates new quickmongo instance
     * @param url The database url
     * @param options The database options
     */
    constructor(url: string, options?: QuickMongoOptions);
    /**
     * If this is a child database
     */
    isChild(): boolean;
    /**
     * If this is a parent database
     */
    isParent(): boolean;
    /**
     * If the database is ready
     */
    get ready(): boolean;
    /**
     * Database ready state
     */
    get readyState(): 0 | mongoose.ConnectionStates;
    /**
     * Get raw document
     * @param key The key
     */
    getRaw(key: string): Promise<DocType<T>>;
    /**
     * Get item from the database
     * @param key The key
     */
    get<V = T>(key: string): Promise<V>;
    /**
     * Get item from the database
     * @param key The key
     */
    fetch<V = T>(key: string): Promise<V>;
    /**
     * Set item in the database
     * @param key The key
     * @param value The value
     * @param [expireAfterSeconds=-1] if specified, quickmongo deletes this data after specified seconds.
     * Leave it blank or set it to `-1` to make it permanent.
     * <warn>Data may still persist for a minute even after the data is supposed to be expired!</warn>
     * Data may persist for a minute even after expiration due to the nature of mongodb. QuickMongo makes sure to never return expired
     * documents even if it's not deleted.
     * @example // permanent
     * await db.set("foo", "bar");
     *
     * // delete the record after 1 minute
     * await db.set("foo", "bar", 60); // time in seconds (60 seconds = 1 minute)
     */
    set(key: string, value: T | unknown, expireAfterSeconds?: number): Promise<T>;
    /**
     * Returns false if the value is nullish, else true
     * @param key The key
     */
    has(key: string): Promise<boolean>;
    /**
     * Deletes item from the database
     * @param key The key
     */
    delete(key: string): Promise<boolean>;
    /**
     * Delete all data from this database
     */
    deleteAll(): Promise<boolean>;
    /**
     * Get the document count in this database
     */
    count(): Promise<number>;
    /**
     * The database latency in ms
     */
    ping(): Promise<number>;
    /**
     * Create a child database, either from new connection or current connection (similar to quick.db table)
     * @param collection The collection name (defaults to `JSON`)
     * @param url The database url (not needed if the child needs to share connection from parent)
     * @example const child = await db.instantiateChild("NewCollection");
     * console.log(child.all());
     */
    instantiateChild<K = unknown>(collection?: string, url?: string): Promise<Database<K>>;
    /**
     * Identical to quick.db table constructor
     * @example const table = new db.table("table");
     * table.set("foo", "Bar");
     */
    get table(): TableConstructor<unknown>;
    /**
     * Use specified collection. Alias of `db.table`
     * @param name The collection name
     */
    useCollection(name: string): Database<unknown, unknown>;
    /**
     * Returns everything from the database
     * @param options The request options
     */
    all(options?: AllQueryOptions): Promise<AllData<T>[]>;
    /**
     * Drops this database
     */
    drop(): Promise<boolean>;
    /**
     * Identical to quick.db push
     * @param key The key
     * @param value The value or array of values
     */
    push(key: string, value: unknown | unknown[]): Promise<T>;
    /**
     * Opposite of push, used to remove item
     * @param key The key
     * @param value The value or array of values
     */
    pull(key: string, value: unknown | unknown[] | ((data: unknown) => boolean), multiple?: boolean): Promise<false | T>;
    /**
     * Identical to quick.db unshift
     * @param key The key
     * @param value The value
     */
    unshift(key: string, value: unknown | unknown[]): Promise<T>;
    /**
     * Identical to quick.db shift
     * @param key The key
     */
    shift(key: string): Promise<T>;
    /**
     * Identical to quick.db pop
     * @param key The key
     */
    pop(key: string): Promise<T>;
    /**
     * Identical to quick.db startsWith
     * @param query The query
     */
    startsWith(query: string): Promise<AllData<T>[]>;
    /**
     * Identical to startsWith but checks the ending
     * @param query The query
     */
    endsWith(query: string): Promise<AllData<T>[]>;
    /**
     * Identical to quick.db add
     * @param key The key
     * @param value The value
     */
    add(key: string, value: number): Promise<T>;
    /**
     * Identical to quick.db subtract
     * @param key The key
     * @param value The value
     */
    subtract(key: string, value: number): Promise<T>;
    /**
     * Identical to quick.db sub
     * @param key The key
     * @param value The value
     */
    sub(key: string, value: number): Promise<T>;
    /**
     * Identical to quick.db addSubtract
     * @param key The key
     * @param value The value
     * @param [sub=false] If the operation should be subtraction
     */
    addSubtract(key: string, value: number, sub?: boolean): Promise<T>;
    /**
     * Identical to quick.db getArray
     * @param key The key
     */
    getArray<Rt = T>(key: string): Promise<Rt[]>;
    /**
     * Connects to the database.
     */
    connect(): Promise<Database<T>>;
    /**
     * Watch collection changes
     */
    watch(): mongodb.ChangeStream<any, mongodb.ChangeStreamDocument<any>>;
    /**
     * The db metadata
     */
    get metadata(): {
        name: string;
        db: string;
        namespace: string;
    };
    /**
     * Returns database statistics
     */
    stats(): Promise<mongodb.CollStats>;
    /**
     * Close the database connection
     * @param force Close forcefully
     */
    close(force?: boolean): Promise<void>;
    private __applyEventsBinding;
    /**
     * Formats document data
     * @param doc The document
     */
    private __formatData;
    /**
     * Checks if the database is ready
     */
    private __readyCheck;
}
interface TableConstructor<V = unknown> {
    new (name: string): Database<V>;
}

/**
 * The util class
 * @extends {null}
 */
declare class Util extends null {
    /**
     * This is a static class, do not instantiate
     */
    private constructor();
    /**
     * Validate
     * @param {any} k The source
     * @param {string} type The type
     * @param {?any} fallback The fallback value
     * @returns {any}
     */
    static v(k: any, type: string, fallback?: any): any;
    /**
     * Picks from nested object by dot notation
     * @param {any} holder The source
     * @param {?string} id The prop to get
     * @returns {any}
     */
    static pick(holder: any, id?: string): any;
    /**
     * Returns master key
     * @param {string} key The key that may have dot notation
     * @returns {string}
     */
    static getKey(key: string): string;
    /**
     * Returns key metadata
     * @param {string} key The key
     * @returns {KeyMetadata}
     */
    static getKeyMetadata(key: string): {
        master: string;
        child: string[];
        target: string;
    };
    /**
     * Utility to validate duration
     * @param {number} dur The duration
     * @returns {boolean}
     */
    static shouldExpire(dur: number): boolean;
    static createDuration(dur: number): Date;
}

interface IDriver {
    prepare(table: string): Promise<void>;
    getAllRows(table: string): Promise<{
        id: string;
        value: any;
    }[]>;
    getRowByKey<T>(table: string, key: string): Promise<[T | null, boolean]>;
    setRowByKey<T>(table: string, key: string, value: any, update: boolean): Promise<T>;
    deleteAllRows(table: string): Promise<number>;
    deleteRowByKey(table: string, key: string): Promise<number>;
}
/**
 * Quick.db compatible mongo driver
 * @example // require quickdb
 * const { QuickDB } = require("quick.db");
 * // require mongo driver from quickmongo
 * const { MongoDriver } = require("quickmongo");
 * // create mongo driver
 * const driver = new MongoDriver("mongodb://localhost/quickdb");
 *
 * // connect to mongodb
 * await driver.connect();
 *
 * // create quickdb instance with mongo driver
 * const db = new QuickDB({ driver });
 *
 * // set something
 * await db.set("foo", "bar");
 *
 * // get something
 * console.log(await db.get("foo")); // -> foo
 */
declare class MongoDriver implements IDriver {
    url: string;
    options: mongoose.ConnectOptions;
    connection: mongoose.Connection;
    private models;
    constructor(url: string, options?: mongoose.ConnectOptions);
    connect(): Promise<MongoDriver>;
    close(force?: boolean): Promise<void>;
    private checkConnection;
    prepare(table: string): Promise<void>;
    private getModel;
    getAllRows(table: string): Promise<{
        id: string;
        value: any;
    }[]>;
    getRowByKey<T>(table: string, key: string): Promise<[T | null, boolean]>;
    setRowByKey<T>(table: string, key: string, value: any, update: boolean): Promise<T>;
    deleteAllRows(table: string): Promise<number>;
    deleteRowByKey(table: string, key: string): Promise<number>;
}

export { AllData, AllQueryOptions, CollectionInterface, Database, DocType, IDriver, MongoDriver, QmEvents, QuickMongoOptions, TableConstructor, Util, docSchema };
