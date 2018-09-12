<div class="container" style="margin-top: 32px;">
    <div class="row">
        <div class="col-md-6 offset-md-3">
            <?php if(!empty($error)) { ?>
                <div class="alert alert-danger" role="alert">
                    <?php
                    switch ($error) {
                        case "INA_LOGIN_FAILED":
                            echo "Login INA gagal, silakan coba di lain waktu.";
                            break;
                        case "NOT_IN_REGISTRY":
                            echo "Pengguna tidak terdaftar sebagai panitia TEC Internship 2018";
                            break;
                        case "USER_REGISTERED":
                            echo "Panitia sudah terdaftar";
                            break;
                        default:
                            echo "Unknown error";
                    }
                    ?>
                </div>
            <?php } ?>
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title mt-3">Ketentuan</h3>
                </div>
                <div class="card-body">
                    <p><b>Baca dan pahami ketentuan di bawah ini.</b></p>
                    <p>Untuk mempermudah pendataan, kami memerlukan Anda untuk melakukan login ke situs INA (login.itb.ac.id) menggunakan username dan password yang Anda miliki.</p>
                    <p>Setelah Anda login menggunakan akun INA, situs ini akan mendapatkan data berupa:</p>
                    <ol>
                        <li>nama lengkap,</li>
                        <li>NIM TPB dan jurusan,</li>
                        <li>alamat e-mail ITB dan non-ITB, dan</li>
                        <li>fakultas serta jurusan Anda.</li>
                    </ol>
                    <p>Password Anda tidak akan melewati situs ini, sehingga password Anda <b>tidak dan tidak dapat</b> dicatat oleh situs ini.</p>
                    <p>Apabila Anda paham dan setuju dengan ketentuan diatas, silakan klik tombol Lanjutkan.</p>

                    <form method="post">
                        <input type="hidden" name="consent" value="1" />
                        <button class="btn btn-primary" type="submit">Lanjutkan &nbsp; <i class="fa fa-arrow-right"></i></button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>