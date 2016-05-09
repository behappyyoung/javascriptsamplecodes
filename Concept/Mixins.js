var young = {
    firstName: 'Young',
    lastName: 'Park'
};


var person = {
    fullName: function () {
        return this.firstName + " " + this.lastName;
    },
    rename: function (first, last) {
        this.firstName = first;
        this.lastName = last;
        return this;
    }
};

var hasCareer = {
    career: function () {
        return this.chosenCareer;
    },
    setCareer: function (career) {
        this.chosenCareer = career;
        return this;
    }
};


var __slice = [].slice;

function extend () {
    var consumer = arguments[0],
        providers = Array.prototype.slice.call(arguments, 1),
        key,
        i,
        provider;
    for (i = 0; i < providers.length; ++i) {
        provider = providers[i];
        for (key in provider) {
            if (provider.hasOwnProperty(key)) {
                consumer[key] = provider[key];
            }
        }
    }
    return consumer;
}



extend(young, person);
extend(young, hasCareer);
young.setCareer('Engineer');
console.log(young,young.fullName(),  young.career());
