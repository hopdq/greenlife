$(function () {
    var bodyModel = ko.observable(new BodyModel());
    var viewModel = new Layout(bodyModel);
    ko.applyBindings(viewModel);
    viewModel.init();
});

function BodyModel() {
    var self = this;
    self.init = function () {

    }
}