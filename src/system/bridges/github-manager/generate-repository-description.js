
module.exports=(
  description,
  checkSum,
  gpgSign
)=>`
  ${description}
  _░▒▓╚╣MD5╠${checkSum}═╣GPG-SIGN╠${gpgSign}═╗
`;
