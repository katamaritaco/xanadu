import _ from 'lodash';
import StackableItem from './items/stackableItem';

export default class Inventory {
  constructor(kwargs) {
    this.maxNumItems = kwargs.maxNumItems || 10;
    this.items = kwargs.items || [];
    this.owningPlayer = kwargs.owningPlayer || null;
  }
  isEmpty() {
    return this.items.length === 0;
  }
  isFull() {
    return this.items.length === this.maxNumItems;
  }
  hasRoom() {
    return !this.isFull();
  }
  findItemIndex(constructor) {
    let constructorName = null;

    if (_.isString(constructor)) {
      constructorName = constructor;
    } else {
      constructorName = constructor.name;
    }

    let itemIndex = _.findIndex(this.items, (item) => item.constructor.name === constructorName);

    return itemIndex;
  }
  findItem(constructor) {
    let ind = this.findItemIndex(constructor);
    if (ind > -1) {
      return this.items[ind];
    } else {
      return null;
    }
  }
  // XXX: allow for construction args?
  addItem(constructor, kwargs = {}) {
    let existingItem = this.findItem(constructor);
    let n = kwargs.amount || 1;

    if (existingItem) {
      if (existingItem instanceof StackableItem) {
        existingItem.addToStack(n);
      } else {
        throw `Tried to add an item ${ constructor.name } already in the inventory!`;
      }
    } else {
      if (this.hasRoom()) {
        let newItem;
        // XXX: this looks suspicious (depth-dependent)
        // What I want to do is check if this
        // constructor function is a subclass of StackableItem
        if (Object.getPrototypeOf(constructor) === StackableItem) {
          newItem = new (constructor)({
            stackAmount: n
          });
        } else {
          newItem = new (constructor)();
        }

        this.items.push(newItem);

      } else {
        throw 'Inventory full!';
      }
    }
  }
  removeItem(constructor, kwargs = {}) {
    let existingItem = this.findItem(constructor);
    let n = kwargs.amount || 1;

    if (existingItem) {
      if (existingItem instanceof StackableItem) {
        // TODO: implement
        console.log(n);
      } else {
        let removedArray = _.remove(this.items,
            (item) => item === existingItem);

        if (removedArray.length !== 1) {
          throw `Strange removed array: ${ removedArray.toString() }`;
        }

        return removedArray[0];
      }
    } else {
      throw `Could not find item ${ constructor.name } in inventory!`;
    }
  }
  toJSON() {
    let outputObjs = _.map(this.items, (item) => item.toJSONObject());

    return JSON.stringify(outputObjs);
  }
}
