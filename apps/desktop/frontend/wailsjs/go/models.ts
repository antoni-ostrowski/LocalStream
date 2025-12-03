export namespace config {
	
	export class Preferences {
	    databasePath: string;
	    sourceDirs: string[];
	
	    static createFrom(source: any = {}) {
	        return new Preferences(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.databasePath = source["databasePath"];
	        this.sourceDirs = source["sourceDirs"];
	    }
	}

}

