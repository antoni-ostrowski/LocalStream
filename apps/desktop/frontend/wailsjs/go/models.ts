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

export namespace playback {
	
	export class PlaybackState {
	    PlayingTrackId: string;
	    playingTrack: sqlcDb.Track;
	    length: number;
	    isPlaying: boolean;
	
	    static createFrom(source: any = {}) {
	        return new PlaybackState(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.PlayingTrackId = source["PlayingTrackId"];
	        this.playingTrack = this.convertValues(source["playingTrack"], sqlcDb.Track);
	        this.length = source["length"];
	        this.isPlaying = source["isPlaying"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace sql {
	
	export class NullBool {
	    Bool: boolean;
	    Valid: boolean;
	
	    static createFrom(source: any = {}) {
	        return new NullBool(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Bool = source["Bool"];
	        this.Valid = source["Valid"];
	    }
	}
	export class NullInt64 {
	    Int64: number;
	    Valid: boolean;
	
	    static createFrom(source: any = {}) {
	        return new NullInt64(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Int64 = source["Int64"];
	        this.Valid = source["Valid"];
	    }
	}
	export class NullString {
	    String: string;
	    Valid: boolean;
	
	    static createFrom(source: any = {}) {
	        return new NullString(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.String = source["String"];
	        this.Valid = source["Valid"];
	    }
	}

}

export namespace sqlcDb {
	
	export class Playlist {
	    id: string;
	    created_at: number;
	    name: string;
	    cover_path: sql.NullString;
	    starred: sql.NullInt64;
	
	    static createFrom(source: any = {}) {
	        return new Playlist(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.created_at = source["created_at"];
	        this.name = source["name"];
	        this.cover_path = this.convertValues(source["cover_path"], sql.NullString);
	        this.starred = this.convertValues(source["starred"], sql.NullInt64);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Track {
	    id: string;
	    created_at: number;
	    path: string;
	    title: string;
	    artist: string;
	    album: string;
	    genre: sql.NullString;
	    year: sql.NullInt64;
	    duration_seconds: sql.NullInt64;
	    starred: sql.NullInt64;
	    is_missing: sql.NullBool;
	
	    static createFrom(source: any = {}) {
	        return new Track(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.created_at = source["created_at"];
	        this.path = source["path"];
	        this.title = source["title"];
	        this.artist = source["artist"];
	        this.album = source["album"];
	        this.genre = this.convertValues(source["genre"], sql.NullString);
	        this.year = this.convertValues(source["year"], sql.NullInt64);
	        this.duration_seconds = this.convertValues(source["duration_seconds"], sql.NullInt64);
	        this.starred = this.convertValues(source["starred"], sql.NullInt64);
	        this.is_missing = this.convertValues(source["is_missing"], sql.NullBool);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

