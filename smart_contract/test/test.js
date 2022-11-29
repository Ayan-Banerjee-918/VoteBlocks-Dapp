var Voters=artifacts.require("Voters")
contract('Voters',function(accounts){
    it("Check Sender address",function(){
        return Voters.deployed().then(function(instance){
            assert(instance.getSender.call());
        })
    });
});