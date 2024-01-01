import { Collection, MongoClient,Document } from "mongodb";
export default class DocumentDbConnection {
  private readonly _connectionString: string;
  private _client: MongoClient | undefined;

  constructor() {
    console.log("constructing document db connection");
    if (process.env.DB_CONNECTION_STRING == undefined) {
      throw new Error("DB_CONNECTION_STRING env variable is not set");
    }
    this._connectionString = process.env.DB_CONNECTION_STRING;
    console.log({connectionString: this._connectionString});
  }

  private async getClient(): Promise<MongoClient> {
    console.log("getting client");
    this._client = await MongoClient.connect(this._connectionString, {
      //tlsCAFile: `docdb-bastion.pem` //Specify the DocDB; cert
    });
    return this._client;
  }

  public async connect(): Promise<void> {
    console.log("connecting to document db");
    await this.getClient();
  }

  public async disconnect(): Promise<void> {
    console.log("disconnecting from document db");
    if (this._client != undefined) {
      await this._client.close();
    }
  }

  public async getCollection<T extends Document>(
    collectionName: string
  ): Promise<Collection<T>> {
    //console.log("getting collection");
    if (this._client == undefined) {
      throw new Error("client is undefined");
    }
    const collection = this._client.db().collection(collectionName);
    //console.log("returning collection", collection);
    return collection as unknown as Collection<T>;
  }
}
