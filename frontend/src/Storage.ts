export module Storage {
    export function saveStorage(key: string, data: object) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    export function getStorage(key: string, item?: any): any {
        if (localStorage.getItem(key) && item) {
            const data = JSON.parse(localStorage.getItem(key));
            return data[item];
        } else if (localStorage.getItem(key)) {
            return localStorage.getItem(key);
        }
        return null;
    }

    export function clearStorage(key:string="false") {
        if (key) {
            localStorage.removeItem(key);
        } else {
            localStorage.clear();
        }
    }
}
