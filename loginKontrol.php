<?php
if (isset($_POST['kadi']) && isset($_POST['sifre'])) { // form gönderilmiş mi
   $kadi = $_POST['kadi'];
   $sifre = $_POST['sifre'];

   if ($kadi == 'B231210095@sakarya.edu.tr' && $sifre == '12345') { // bilgiler doğru mu
      session_start();
      $_SESSION['kadi'] = 'B231210095@sakarya.edu.tr';
      $_SESSION['sifre'] = '12345';

      echo '<html>
<head>
<meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  
  <link rel="stlesheet" type="text/css" href="css/bootstrap.min.css">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
  integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  <link rel="stylesheet" type="text/css" href="css/main.css">
  <link href="https://fonts.googleapis.com/css?family=Bree+Serif" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Days+One" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Viga" rel="stylesheet">
  
</head>
<body>

<h2 id="loginbaslik">Hoşgeldiniz <?php echo $kadi; ?></h2> <br>
<h2 id="loginbaslik">Başarıyla giriş yaptınız. Şimdi içeriğe ulaşabilirsiniz.</h2>


<h1 id="loginbaslik" style="text-align=center;"><a id="loginbaslik" href="Anasayfa.html">ANASAYFAYA GİT</a></h1>


</body>
</html>';
   } else {

      echo "<h2 id='loginbaslik'>Yanlış kullanıcı adı veya şifre. </h2>";
      echo "<h1 id='loginbaslik' style='text-align=center;'><a id='loginbaslik' href='login.html'>Giriş sayfasına dönmek için tıklayınız.</a></h1>";
   }
}
?>