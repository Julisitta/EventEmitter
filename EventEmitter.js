class EventEmitter {
    constructor() {
        this._events = {};
    }
    addSubscriber(topicName, callback) {
        if(!this._events[topicName]) {
            this._events[topicName] = [];
        }
        this._events[topicName].push(callback);
    }
    removeSubscriber(topicName, callback) {
        const event = this._events[topicName];
        if (event) {
            this._events[topicName] = event.filter(eventCb => callback !== eventCb);
        }
    }
    emit(topicName, data) {
        const event = this._events[topicName];
        if(event) {
            event.forEach(callback => callback(data));
        }
    }
}

class User {
    constructor(name) {
        this.name = name;
        this.inform = this.inform.bind(this);
    }
    inform(data) {
        console.log(this.name + " get " + data);
    }
}

class Jurnaluga {
    constructor(name, topics) {
        this.name = name;
        this.topics = topics;
    }
    sendNews(topic) {
        let rnd = Math.random().toString(36).substring(2, 15);
        return this.name + " with " + topic + " about " + rnd;
    }
    interval(myEventEmit, topic) {
        let timerId = setInterval(
            () => myEventEmit.emit(topic, this.sendNews(topic)),
            1000
        );
        setTimeout(
            () => clearInterval(timerId),
            5000
        );
    }	
}

const myEventEmitter = new EventEmitter();

let user1 = new User("Margo");
let user2 = new User("Renat");
let user3 = new User("Kate");

let topics = ["ShouBiz", "Cars", "Feshion"]

let jur = new Jurnaluga("CrocusSity", topics);

myEventEmitter.addSubscriber(topics[0], user1.inform);
myEventEmitter.addSubscriber(topics[1], user1.inform);
myEventEmitter.addSubscriber(topics[1], user2.inform);
myEventEmitter.addSubscriber(topics[0], user3.inform);
myEventEmitter.addSubscriber(topics[2], user3.inform);

myEventEmitter.emit(topics[0], jur.sendNews(topics[0]));
myEventEmitter.emit(topics[1], jur.sendNews(topics[1]));
myEventEmitter.emit(topics[2], jur.sendNews(topics[2]));

myEventEmitter.removeSubscriber(topics[2], user3.inform);

myEventEmitter.emit(topics[0], jur.sendNews(topics[0]));
myEventEmitter.emit(topics[1], jur.sendNews(topics[1]));
myEventEmitter.emit(topics[2], jur.sendNews(topics[2]));

jur.interval(myEventEmitter, topics[0]);
