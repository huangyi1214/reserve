let express = require('express');

let oauth = require('./controllers/oauth');



let multipart =require('connect-multiparty');


const router = express.Router();
router.use(multipart({ uploadDir: __dirname + '/temp' }));
const multipartMiddleware = multipart();
/**
 * 
 */
router.post('/login', oauth.login);
router.post('/login_admin', oauth.login_admin);
router.post('/logout', oauth.logout);
router.post('/sendMsg', oauth.sendMsg);
router.get('/checkemail', oauth.checkemail);
router.get('/getUserInfo', oauth.useroauth, oauth.getUserInfo);

// router.post('/candidateadd', oauth.useroauth, candidate.candidateadd);
// router.post('/candidateupdate', oauth.useroauth, candidate.candidateupdate);
// router.post('/candidatedelete', oauth.useroauth, candidate.candidatedelete);
// router.post('/candidatesearch', oauth.useroauth, candidate.candidatesearch);


// router.post('/voteadd', oauth.useroauth, vote.voteadd);
// router.post('/voteupdate', oauth.useroauth, vote.voteupdate);
// router.post('/votedelete', oauth.useroauth, vote.votedelete);
// router.post('/votesearch', oauth.useroauth, vote.votesearch);
// router.post('/voteDetailAdd', oauth.useroauth, vote.voteDetailAdd);
// router.post('/voteDetaildelete', oauth.useroauth, vote.voteDetaildelete);
// router.post('/votedetailsearch', oauth.useroauth, vote.votedetailsearch);
// router.post('/uservote', oauth.useroauth, voteAction.uservote);
// router.post('/voteresult', oauth.useroauth, voteAction.voteresult);
router.get('/getallday', oauth.getallday);
router.get('/getreserve' , oauth.getreserve);
router.post('/setreserve', oauth.setreserve);
module.exports = router;