class EventEmitter {
    constructor() {
        this._storage = {};
    }
    addSubscriber(topicName, callback) {
        if(!this._storage[topicName]) {
            this._storage[topicName] = [];
        }
        this._storage[topicName].push(callback);
    }
    removeSubscriber(topicName, callback) {
        let stor = this._storage[topicName];
        if (stor) {
            stor = stor.filter(storCb => callback !== storCb);
        }
    }
    emit(topicName, data) {
        let stor = this._storage[topicName];
        if(stor) {
            stor.forEach(callback => callback(data));
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
        return this.name + " topic: " + topic + " about " + rnd;
    }
    interval(myEventEmit, topic) {
        let timerId = setInterval(() => 
            myEventEmit.emit(topic, this.sendNews(topic)),
            1000);
        setTimeout(() => 
                clearInterval(timerId),
            5000);
    }	
}

let myEventEmitter = new EventEmitter();

let user1 = new User("Margo");
let user2 = new User("Renat");
let user3 = new User("Kate");

let topics = ["ShouBiz", "Cars", "Fashion"]

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
