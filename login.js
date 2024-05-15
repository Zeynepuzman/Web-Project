function isValid(frm) {


    var kadi = frm.kadi.value;

    var sifre = frm.sifre.value;

    var atpos=email.indexOf("@");
    var dotpos=email.lastIndexOf(".");


    if ( atpos<1 || dotpos<atpos+2 || dotpos+2>=kadi.length )
    {
        alert("Geçerli email adresi girin");
        return false;
    }    

    else if (sifre == "") {

        alert("Bu alan boş bırakılamaz.");

        return false;

    }
    return true;


}   