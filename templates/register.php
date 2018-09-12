<?php
$interests = array("Tech|tech", "F&B|fnb", "Fashion|fashion", "Arts & Design|artsndesign", "Books & Magz|booksnmagz", "Financial|financial", "Travel|travel", "Hospitality|hospitality", "Entertainment|entertainment")
?>
<link rel="stylesheet" type="text/css" href="<?=BASE_URL?>/css/stepper.css" />

  <!--EMPTY PADDING -->
  <div class="mb-5"></div>

  <div class="container">
      <form method="post" action="<?=BASE_URL?>/reset">
          <div class="card">
              <div class="card-body">
                  <b>Kamu mendaftar sebagai:</b>
                  <h4><?=@$nama?> &nbsp; <small>(<?=@$ou?>)</small></h4>
                  <button style="margin-top: 8px;" type="submit" class="btn btn-secondary btn-sm">Ini bukan saya :(</button>
              </div>
          </div>
      </form>
      <form onsubmit="registrasi(); return false;" style="margin-top: 32px;">
          <div class="step">
              <div>
                  <div class="circle">1</div>
                  <div class="line"></div>
              </div>
              <div>
                  <div class="title">Sedikit tentang kamu</div>
                  <div class="body">
                      <div class="row">
                          <div class="col-md-6 order-md-1 d-flex">
                              <div>
                                  <h5>Selamat datang!</h5>
                                  <p>Beberapa data di sebelah kiri sudah diisikan dari akun INA. Tolong lengkapi sisanya.</p>
                              </div>
                          </div>

                          <div class="col-md-6 order-md-0">
                              <div class="form-group">
                                  <label for="regisNama" class="cols-sm-2 control-label">Nama Lengkap</label>
                                  <div class="cols-sm-10">
                                      <div class="input-group">
                                          <input type="text" class="form-control" id="regisNama" disabled="disabled" placeholder="Sabudi Toni" value="<?=@$nama?>"/>
                                          <div class="invalid-feedback">
                                              Nama tidak valid
                                          </div>
                                      </div>
                                  </div>
                              </div>

                              <div class="form-group">
                                  <label for="regisNick" class="cols-sm-2 control-label">Nama Panggilan</label>
                                  <div class="cols-sm-10">
                                      <div class="input-group">
                                          <input type="text" class="form-control" id="regisNick"  placeholder="Budi"/>
                                          <div class="invalid-feedback">
                                              Nama tidak valid
                                          </div>
                                      </div>
                                  </div>
                              </div>

                              <div class="form-group">
                                  <label for="regisNim" class="cols-sm-2 control-label">NIM</label>
                                  <div class="cols-sm-10">
                                      <div class="input-group">
                                          <input type="text" class="form-control" id="regisNim" disabled="disabled" placeholder="XXXYYZZZ" value="<?=@$nim?>" />
                                          <div class="invalid-feedback">
                                              NIM tidak valid
                                          </div>
                                      </div>
                                  </div>
                              </div>

                              <div class="form-group">
                                  <label for="regisEmail" class="cols-sm-2 control-label">Email</label>
                                  <div class="cols-sm-10">
                                      <div class="input-group">
                                          <input type="email" class="form-control" id="regisEmail"  placeholder="email@example.com" value="<?=@$email?>" />
                                          <div id="email-feedback" class="invalid-feedback">
                                              Email tidak valid
                                          </div>
                                      </div>
                                  </div>
                              </div>

                              <div class="form-group">
                                  <label for="regisLINE" class="cols-sm-2 control-label">ID LINE</label>
                                  <div class="cols-sm-10">
                                      <div class="input-group">
                                          <input type="text" class="form-control" id="regisLINE"  placeholder="idtec"/>
                                          <div class="invalid-feedback">
                                              ID tidak valid
                                          </div>
                                      </div>
                                  </div>
                              </div>

                              <div class="form-group">
                                  <label for="regisInsta" class="cols-sm-2 control-label">Instagram</label>
                                  <div class="cols-sm-10">
                                      <div class="input-group">
                                          <input type="text" class="form-control" id="regisInsta"  placeholder="idtec"/>
                                          <div class="invalid-feedback">
                                              ID tidak valid
                                          </div>
                                      </div>
                                  </div>
                              </div>

                              <div class="form-group">
                                  <label for="regisHP" class="cols-sm-2 control-label">No HP</label>
                                  <div class="cols-sm-10">
                                      <div class="input-group">
                                          <input type="tel" class="form-control" id="regisHP"  placeholder="0818123123"/>
                                          <div class="invalid-feedback">
                                              No HP tidak valid
                                          </div>
                                      </div>
                                  </div>
                              </div>

                              <div class="form-group">
                                  <label for="regisAlamat" class="cols-sm-2 control-label">Alamat</label>
                                  <div class="cols-sm-10">
                                      <div class="input-group">
                                          <input type="text" class="form-control" id="regisAlamat"  placeholder="Jl Bandung"/>
                                          <div class="invalid-feedback">
                                              Harus terisi
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div class="step">
              <div>
                  <div class="circle">2</div>
                  <div class="line"></div>
              </div>
              <div>
                  <div class="title">Minat, bakat, dan kepribadian kamu</div>
                  <div class="body">
                      <div class="row">
                          <div class="col-md-6 order-md-1 d-flex">
                              <div>
                                  <h5>Isi data ini dengan sejujur-jujurnya.</h5>
                                  <p>Kami memerlukan data-data ini biar keren aja.</p>
                              </div>
                          </div>

                          <div class="col-md-6 order-md-0">
                              <div class="form-group">
                                  <label for="regisAbout" class="cols-sm-2 control-label">
                                      Tentang saya
                                      <br />
                                      <small>Isi dengan profil singkat tentang kamu, maksimal 150 huruf.</small>
                                  </label>
                                  <div class="cols-sm-10">
                                      <div class="input-group">
                                          <textarea class="form-control" id="regisAbout" maxlength="150" placeholder="Saya manusia biasa yang tak kenal lelah"></textarea>
                                          <div class="invalid-feedback">
                                              Harus terisi
                                          </div>
                                      </div>
                                  </div>
                              </div>


                              <div class="form-group">
                                  <label for="regisInter" class="cols-sm-2 control-label">
                                      Interest
                                      <br />
                                      <small>Pilih minimal dua bidang yang kamu minati.</small>
                                  </label>
                                  <div class="cols-sm-10">
                                      <div class="input-group">
                                          <input type="hidden" class="form-control" id="regisInter"/>
                                          <div class="searchable-container">
                                              <?php
                                              foreach ($interests as $interest) {
                                                  $data = explode("|", $interest);
                                                  ?>
                                                  <div class="info-block block-info clearfix">
                                                      <div class="square-box pull-left">
                                                          <span class="glyphicon glyphicon-tags glyphicon-lg"></span>
                                                      </div>
                                                      <div data-toggle="buttons" class="btn-group bizmoduleselect">
                                                          <label class="btn btn-default">
                                                              <div class="bizcontent">
                                                                  <input type="checkbox" name="interest" autocomplete="off" value="<?=$data[1]?>">
                                                                  <span class="glyphicon glyphicon-ok glyphicon-lg"></span>
                                                                  <span><?=$data[0]?></span>
                                                              </div>
                                                          </label>
                                                      </div>
                                                  </div>
                                              <?php } ?>
                                          </div>

                                          <div class="invalid-feedback">
                                              Minimal memilih dua item
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div class="step">
              <div>
                  <div class="circle">3</div>
                  <div class="line"></div>
              </div>
              <div>
                  <div class="title">Kredensial kamu</div>
                  <div class="body">
                      <div class="row">
                          <div class="col-md-6 order-md-1 d-flex">
                              <div>
                                  <h5>Satu hal lagi!</h5>
                                  <p>Silahkan isi kata sandi yang kamu inginkan, untuk bisa login ke website dan internApp.</p>
                              </div>
                          </div>

                          <div class="col-md-6 order-md-0">
                              <div class="form-group">
                                  <label for="regisPass" class="cols-sm-2 control-label">Password</label>
                                  <div class="cols-sm-10">
                                      <div class="input-group">
                                          <input type="password" class="form-control" id="regisPass"  placeholder="Password"/>
                                          <div class="invalid-feedback">
                                              Password tidak valid (minimal 10 karakter)
                                          </div>
                                      </div>
                                  </div>

                              </div>

                              <div class="form-group">
                                  <label for="regisConf" class="cols-sm-2 control-label">Konfirmasi Password</label>
                                  <div class="cols-sm-10">
                                      <div class="input-group">
                                          <input type="password" class="form-control" id="regisConf"  placeholder="Password"/>
                                          <div class="invalid-feedback">
                                              Password tidak sama
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <div id="regisButtonLoc" class="form-group ">
            <div class="input-group">
              <button type="submit" id="regisButton" class="rounded form-control w-100 btn btn-primary" style="white-space: normal;">Daftar! (mana saya tahu saya kan panitia)</button>
              <div class="invalid-feedback">
                Ada data yang tidak valid
              </div>
            </div>
          </div>

      </form>
  </div>
  <script src="<?=BASE_URL?>/js/regis.js" defer="defer"></script>

  <!-- Latest compiled and minified CSS -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.13.1/css/bootstrap-select.min.css">

  <!-- Latest compiled and minified JavaScript -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.13.1/js/bootstrap-select.min.js" defer="defer"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/jquery-scrollTo/2.1.2/jquery.scrollTo.min.js" defer="defer"></script>
