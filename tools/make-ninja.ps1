# =============================================================================
#  Draws the sign-in sprite: an old Italian man taking a tomato apart.
#
#  There is no image generator here, so the frames are drawn from primitives on
#  a 72x56 canvas with anti-aliasing OFF — that is what makes it read as pixel
#  art rather than a small smooth drawing. Output is one horizontal strip; the
#  CSS steps() through it.
#
#  Things that had to be got right, learned by drawing it wrong first:
#   - his torso runs off the bottom edge, or he reads as a head floating on a jar
#   - the apron is green, not red, or it fights the tomato for the only red
#   - the moustache is brighter than the hair, or the two merge into one blob
#   - halves are clipped semicircles with a pale cut face, not two whole
#     tomatoes with a line drawn between them
#
#  Re-run:  ! pwsh tools/make-ninja.ps1
# =============================================================================
Add-Type -AssemblyName System.Drawing

$W = 72; $H = 56; $FRAMES = 8
$OUT = Join-Path $PSScriptRoot "..\img\ninja.png"

function C([string]$hex) { [System.Drawing.ColorTranslator]::FromHtml($hex) }
$INK     = C "#1d1409"
$SKIN    = C "#d9a273"
$SKIN_D  = C "#ab7548"
$HAIR    = C "#b3ada0"   # grey, deliberately duller than the moustache
$TASH    = C "#f6f2e8"   # the moustache, brightest thing on his face
$SHIRT   = C "#f4efe2"
$SHIRT_D = C "#d3cbb7"
$APRON   = C "#33502c"   # green: the tomato keeps the red to itself
$APRON_D = C "#253b20"
$RED     = C "#d4321e"
$RED_D   = C "#95200f"
$FLESH   = C "#f0a58c"   # the cut face
$SEED    = C "#f7d9b0"
$GREEN   = C "#5f9130"
$BLADE   = C "#d2d7dd"
$BLADE_D = C "#8d939b"
$HANDLE  = C "#6b4423"
$BOARD   = C "#c99a5c"
$BOARD_D = C "#9c7038"
$FLASH   = C "#fff8df"

function Brush($c) { New-Object System.Drawing.SolidBrush($c) }
function Pen($c,$w) { New-Object System.Drawing.Pen($c,[single]$w) }

# knife angle (0 = pointing right), the slash streak, how far the halves have
# parted, and whether the next tomato is already dropping in
#  The arm lifts straight back out of the way after the cut. Left low, it lies
#  across the board and hides the two halves, which are the whole payoff.
$SEQ = @(
  @{ ang=-72; slash=$false; split=0;  trail=$false; drop=$null },
  @{ ang=-84; slash=$false; split=0;  trail=$false; drop=$null },
  @{ ang=-45; slash=$true;  split=0;  trail=$true;  drop=$null },
  @{ ang= -6; slash=$true;  split=1;  trail=$true;  drop=$null },
  @{ ang= 18; slash=$false; split=4;  trail=$false; drop=$null },
  @{ ang=-18; slash=$false; split=7;  trail=$false; drop=$null },
  @{ ang=-48; slash=$false; split=9;  trail=$false; drop=$null },
  @{ ang=-68; slash=$false; split=11; trail=$false; drop=16 }
)

$sheet = New-Object System.Drawing.Bitmap(($W*$FRAMES), $H)
$sg = [System.Drawing.Graphics]::FromImage($sheet)
$sg.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None
$sg.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
$sg.Clear([System.Drawing.Color]::Transparent)

# a tomato half: a clipped semicircle with a flat pale face on the cut side
function Half($g, $cx, $cy, $r, [bool]$isLeft) {
  $st = $g.Save()
  $x = if ($isLeft) { $cx - $r } else { $cx }
  $g.SetClip((New-Object System.Drawing.Rectangle([int]$x, [int]($cy-$r), [int]$r, [int]($r*2))))
  $g.FillEllipse((Brush $RED), ($cx-$r), ($cy-$r), ($r*2), ($r*2))
  $g.FillEllipse((Brush $RED_D), ($cx-$r), ($cy+1), ($r*2), ($r-1))
  $g.Restore($st)
  # the cut face, on the flat side
  if ($isLeft) { $fx = $cx - 2; $ex = $cx - 2 } else { $fx = $cx; $ex = $cx + 1 }
  $g.FillRectangle((Brush $FLESH), [int]$fx, [int]($cy-$r+2), 2, [int]($r*2-4))
  $g.FillRectangle((Brush $SEED),  [int]$fx, [int]($cy-2),    2, 3)
  $g.FillRectangle((Brush $INK),   [int]$ex, [int]($cy-$r+1), 1, [int]($r*2-2))
}

for ($i = 0; $i -lt $FRAMES; $i++) {
  $f = $SEQ[$i]
  $bm = New-Object System.Drawing.Bitmap($W, $H)
  $g = [System.Drawing.Graphics]::FromImage($bm)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
  $g.Clear([System.Drawing.Color]::Transparent)

  # ---------------------------------------------------------------- the man
  # torso runs off the bottom edge — he is standing behind the counter
  $g.FillRectangle((Brush $SHIRT),   6, 24, 26, 32)
  $g.FillRectangle((Brush $SHIRT_D), 6, 24,  4, 32)
  $g.FillRectangle((Brush $APRON),  11, 33, 19, 23)
  $g.FillRectangle((Brush $APRON_D),11, 33,  3, 23)
  $g.FillRectangle((Brush $INK),     6, 24, 26,  1)
  $g.FillRectangle((Brush $SHIRT),  14, 20,  8,  6)      # collar
  $g.FillRectangle((Brush $SKIN),   15, 19,  6,  4)      # neck

  # head
  $g.FillRectangle((Brush $SKIN),    9,  6, 17, 15)
  $g.FillRectangle((Brush $SKIN_D),  9,  6,  3, 15)
  $g.FillRectangle((Brush $SKIN_D),  9, 19, 17,  2)      # jaw shadow
  # grey at the sides and back, bald on top
  $g.FillRectangle((Brush $HAIR),    7,  8,  3,  9)
  $g.FillRectangle((Brush $HAIR),   25,  8,  3,  9)
  $g.FillRectangle((Brush $HAIR),    7,  5, 21,  3)
  $g.FillRectangle((Brush $SKIN),   12,  5,  11, 2)
  # ears
  $g.FillRectangle((Brush $SKIN_D),  7, 12,  2,  3)
  $g.FillRectangle((Brush $SKIN_D), 26, 12,  2,  3)
  # eyes, with brows — the brows are what make him old
  $g.FillRectangle((Brush $HAIR),   12, 10,  4,  1)
  $g.FillRectangle((Brush $HAIR),   19, 10,  4,  1)
  $g.FillRectangle((Brush $INK),    13, 12,  2,  2)
  $g.FillRectangle((Brush $INK),    20, 12,  2,  2)
  $g.FillRectangle((Brush $SKIN_D), 17, 13,  2,  3)      # nose
  # the moustache: brighter than the hair, or the whole face turns to mush
  $g.FillRectangle((Brush $TASH),   12, 16, 12,  3)
  $g.FillRectangle((Brush $TASH),   10, 17,  2,  3)
  $g.FillRectangle((Brush $TASH),   24, 17,  2,  3)

  # ---------------------------------------------------------------- board
  $g.FillRectangle((Brush $BOARD),   32, 46, 40, 4)
  $g.FillRectangle((Brush $BOARD_D), 32, 49, 40, 2)
  $g.FillRectangle((Brush $INK),     32, 51, 40, 1)

  # ---------------------------------------------------------------- tomato
  $tx = 52; $ty = 39; $tr = 7
  if ([int]$f.split -eq 0) {
    $g.FillEllipse((Brush $RED),   ($tx-$tr), ($ty-$tr), ($tr*2), ($tr*2))
    $g.FillEllipse((Brush $RED_D), ($tx-$tr), ($ty+1),   ($tr*2), ($tr-1))
    $g.FillRectangle((Brush $GREEN), ($tx-3), ($ty-$tr-2), 6, 3)
    $g.FillRectangle((Brush $GREEN), ($tx-1), ($ty-$tr-4), 2, 2)
  } else {
    $s = [int]$f.split
    Half $g ($tx-$s) $ty $tr $true
    Half $g ($tx+$s) $ty $tr $false
    if ($s -ge 4) {   # bits fly off
      $g.FillRectangle((Brush $RED), ($tx-2), ($ty-$tr-4), 2, 2)
      $g.FillRectangle((Brush $RED), ($tx+5), ($ty-$tr-6), 2, 2)
    }
  }
  if ($f.drop) {
    $g.FillEllipse((Brush $RED), ($tx-5), ([int]$f.drop), 11, 11)
    $g.FillRectangle((Brush $GREEN), ($tx-2), ([int]$f.drop-2), 4, 2)
  }

  # ---------------------------------------------------------------- the swing
  if ($f.trail) {
    $pen = Pen $FLASH 1
    $g.DrawArc($pen, 4, 2, 76, 68, -66, 40)
    $pen.Dispose()
  }

  # ---------------------------------------------------------------- arm + knife
  $st = $g.Save()
  $g.TranslateTransform(29, 32)                 # shoulder
  $g.RotateTransform([single]$f.ang)
  # reach kept to 38px: any longer and the blade leaves the frame mid-swing
  $g.FillRectangle((Brush $SHIRT), 0, -4, 8, 8)       # sleeve
  $g.FillRectangle((Brush $INK),   0, -5, 8, 1)
  $g.FillRectangle((Brush $SKIN),  7, -3, 7, 6)       # forearm
  $g.FillRectangle((Brush $SKIN_D),7,  1, 7, 2)
  $g.FillRectangle((Brush $SKIN), 13, -4, 5, 8)       # fist
  $g.FillRectangle((Brush $HANDLE),17,-3, 6, 6)
  $g.FillRectangle((Brush $BLADE), 23,-3, 15, 5)
  $g.FillRectangle((Brush $BLADE_D),23, 1, 15, 1)
  $g.FillRectangle((Brush $INK),   23,-4, 15, 1)
  $g.FillRectangle((Brush $INK),   23, 2, 15, 1)
  $g.Restore($st)

  # ---------------------------------------------------------------- the slash
  if ($f.slash) {
    $p1 = Pen $FLASH 2; $p2 = Pen $FLASH 1
    $g.DrawLine($p1, 64, 14, 42, 48)
    $g.DrawLine($p2, 70, 18, 48, 52)
    $p1.Dispose(); $p2.Dispose()
  }

  $sg.DrawImage($bm, ($i*$W), 0, $W, $H)
  $g.Dispose(); $bm.Dispose()
}

$sg.Dispose()
if (Test-Path $OUT) { Remove-Item $OUT -Force }
$sheet.Save($OUT, [System.Drawing.Imaging.ImageFormat]::Png)
$sheet.Dispose()
$fi = Get-Item $OUT
"wrote $($fi.FullName)"
"  $($W*$FRAMES) x $H  ($FRAMES frames of ${W}x${H})  $([math]::Round($fi.Length/1KB,1)) KB"
