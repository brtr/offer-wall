import { OfferAddress, OfferABI } from "./data.js";

(function() {
  let loginAddress;
  const TargetChain = {
    id: "5",
    name: "goerli"
  };

  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
  const signer = provider.getSigner();
  const OfferContract = new ethers.Contract(OfferAddress, OfferABI, provider);
  const offerWithSigner = OfferContract.connect(signer);

  function fetchErrMsg (err) {
    const errMsg = err.error ? err.error.message : err.message;
    alert('Error:  ' + errMsg.split(": ")[1]);
    $("#loading").hide();
  }

  async function checkChainId () {
    const { chainId } = await provider.getNetwork();
    if (chainId != parseInt(TargetChain.id)) {
      alert("We don't support this chain, please switch to " + TargetChain.name + " and refresh");
      return;
    }
  }

  const toggleLoginBtns = function() {
    if (loginAddress == null) {
      $("#btn-login").show();
      $("#btn-logout").hide();
      $("#address").hide();
    } else {
      $("#btn-login").hide();
      $("#btn-logout").show();
      $("#address").text(loginAddress).show();
    }
  }

  const checkLogin = async function() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    if (accounts.length > 0) {
      loginAddress = accounts[0];
    } else {
      loginAddress = null;
    }
    toggleLoginBtns();
    $("#loading").hide();
  }

  const addOffer = async function() {
    try {
      $("#loading").show();
      const name = $("#offerName").val();
      const reward = $("#offerReward").val();
      const count = $("#offerCount").val();
      const contract = $("#contract").val();
      const level = $("#level").val();
      const token = $("#token").val();
      const tx = await offerWithSigner.addOffer(name, contract, reward, count, level, token);
      console.log("sending tx, ", tx);
      await tx.wait();
      console.log("received tx ", tx);
      location.reload();
    } catch (err) {
      fetchErrMsg(err);
    }
  }

  const take = async function(tokenId) {
    try {
      $("#loading").show();
      const tx = await offerWithSigner.take(tokenId);
      console.log("sending tx, ", tx);
      await tx.wait();
      console.log("received tx ", tx);
      location.reload();
    } catch (err) {
      fetchErrMsg(err);
    }
  }

  const claim = async function(tokenId) {
    try {
      $("#loading").show();
      const tx = await offerWithSigner.claim(tokenId);
      console.log("sending tx, ", tx);
      await tx.wait();
      console.log("received tx ", tx);
      location.reload();
    } catch (err) {
      fetchErrMsg(err);
    }
  }

  const mountedTable = async function() {
    $("#loading").show();
    let data = [];
    const offers = await OfferContract.getOffers();

    for (var i=0;i<offers.length;i++){
      data.push({
        "id":     offers[i].tokenId,
        "name":   offers[i].name,
        "reward": offers[i].reward,
        "count":  offers[i].count,
        "level":  offers[i].level,
        "token":  offers[i].requires
      })
    }

    console.log("data: ", data);

    if (data.length > 0) {
      $('#table').bootstrapTable({
        data: data
      })
    }
  }

  if (window.ethereum) {
    $("#btn-login").on('click', function() {
      checkLogin();
    })

    $("#btn-logout").on('click', function() {
      loginAddress = null;
      toggleLoginBtns();
    })

    $("#addBtn").on('click', function() {
      $("#newOfferModal").modal('show');
    })

    checkLogin();
    mountedTable();
    checkChainId();

    $(document).on("click", "#submitBtn", function() {
      $("#newOfferModal").modal('hide');
      addOffer();
    })

    $(document).on("click", "#takeBtn", function() {
      take($(this).data("tokenid"));
    })

    $(document).on("click", "#claimBtn", function() {
      claim($(this).data("tokenid"));
    })

    // detect Metamask account change
    ethereum.on('accountsChanged', function (accounts) {
      console.log('accountsChanges',accounts);
      loginAddress = accounts[0];
      toggleLoginBtns();
    });

     // detect Network account change
    ethereum.on('chainChanged', function(networkId){
      console.log('networkChanged',networkId);
      if (networkId != parseInt(TargetChain.id)) {
        alert("We don't support this chain, please switch to " + TargetChain.name);
      }
    });
  } else {
    console.warn("No web3 detected.");
  }
})();
