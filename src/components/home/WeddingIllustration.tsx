export function WeddingIllustration() {
  return (
    <svg viewBox="0 0 560 600" role="img" aria-labelledby="wedding-art-title" className="block h-auto w-full">
      <title id="wedding-art-title">A warm illustration of a couple beneath a wedding arch</title>
      <defs>
        <linearGradient id="art-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f9e5dd" /><stop offset="1" stopColor="#f5efe4" /></linearGradient>
        <linearGradient id="arch" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fffaf4" /><stop offset="1" stopColor="#f7ded5" /></linearGradient>
        <clipPath id="art-clip"><rect width="560" height="600" rx="36" /></clipPath>
      </defs>
      <g clipPath="url(#art-clip)">
        <rect width="560" height="600" fill="url(#art-bg)" />
        <circle cx="448" cy="108" r="82" fill="#f0d1c5" opacity=".42" />
        <circle cx="74" cy="440" r="122" fill="#e4d9c5" opacity=".34" />
        <path d="M70 570V274a210 210 0 0 1 420 0v296" fill="url(#arch)" stroke="#c89580" strokeWidth="3" />
        <path d="M98 570V280a182 182 0 0 1 364 0v290" fill="none" stroke="#e5c3b4" strokeWidth="2" />
        <path d="M143 570V288a137 137 0 0 1 274 0v282" fill="#f4e5d8" opacity=".8" />
        <circle cx="280" cy="184" r="44" fill="#e8c894" opacity=".8" />
        <path d="M280 140v88m-44-44h88" stroke="#fff8e9" strokeWidth="2" opacity=".7" />

        {/* Couple silhouettes */}
        <circle cx="248" cy="317" r="24" fill="#8f5d4e" />
        <path d="M216 394c3-34 13-51 32-51s29 17 32 51l9 126h-82z" fill="#b77d6d" />
        <path d="M216 393c-18 18-29 52-34 96m98-96c17 17 26 51 30 96" fill="none" stroke="#8f5d4e" strokeWidth="10" strokeLinecap="round" />
        <circle cx="309" cy="305" r="23" fill="#a66e59" />
        <path d="M281 338c-19 17-29 59-33 112l-11 56h146l-14-75c-5-48-20-83-43-93-14 12-31 12-45 0" fill="#fffaf4" />
        <path d="M281 338c-12 11-20 30-25 54l41 19-16 95h102l-14-75c-5-48-20-83-43-93-14 12-31 12-45 0" fill="#e9c7b9" opacity=".78" />
        <path d="M257 393c14 18 31 27 51 28 20 1 37-6 52-21" fill="none" stroke="#d2a895" strokeWidth="3" />
        <path d="M273 425c9 9 17 13 25 14" stroke="#b77d6d" strokeWidth="5" strokeLinecap="round" />
        <path d="M337 423c-9 10-17 15-26 16" stroke="#b77d6d" strokeWidth="5" strokeLinecap="round" />

        {/* Garden arrangements */}
        <path d="M96 555c8-49 13-82 32-117m-19 79c-20-18-27-32-27-48m38 25c16-15 21-31 20-47m278 108c-5-45-12-77-28-111m14 74c19-14 27-29 28-45m-36 25c-14-15-20-30-19-47" fill="none" stroke="#71836c" strokeWidth="5" strokeLinecap="round" />
        <g fill="#a7b195"><ellipse cx="95" cy="464" rx="18" ry="8" transform="rotate(35 95 464)"/><ellipse cx="136" cy="444" rx="17" ry="8" transform="rotate(-38 136 444)"/><ellipse cx="82" cy="484" rx="16" ry="7" transform="rotate(25 82 484)"/><ellipse cx="447" cy="463" rx="17" ry="8" transform="rotate(-32 447 463)"/><ellipse cx="423" cy="440" rx="18" ry="8" transform="rotate(38 423 440)"/><ellipse cx="459" cy="485" rx="16" ry="7" transform="rotate(-20 459 485)"/></g>
        <g fill="#c77f78"><circle cx="110" cy="426" r="13"/><circle cx="141" cy="415" r="11"/><circle cx="79" cy="447" r="10"/><circle cx="435" cy="419" r="12"/><circle cx="466" cy="438" r="11"/><circle cx="407" cy="430" r="9"/></g>
        <g fill="#f8e8d9"><circle cx="110" cy="426" r="4"/><circle cx="141" cy="415" r="3.5"/><circle cx="79" cy="447" r="3"/><circle cx="435" cy="419" r="4"/><circle cx="466" cy="438" r="3.5"/><circle cx="407" cy="430" r="3"/></g>
        <path d="M0 548c89-25 171-18 260 0 101 21 194 20 300-5v57H0z" fill="#d9d1bc" opacity=".58" />
        <rect x="327" y="42" width="179" height="56" rx="18" fill="#fffaf5" opacity=".95" />
        <circle cx="354" cy="70" r="14" fill="#f3ded5" /><path d="M354 76s-8-4-8-9a4 4 0 0 1 8-2 4 4 0 0 1 8 2c0 5-8 9-8 9" fill="#b77d6d" />
        <text x="378" y="67" fill="#79584e" fontFamily="sans-serif" fontSize="11" letterSpacing="1.2">MADE FOR</text>
        <text x="378" y="83" fill="#49342f" fontFamily="sans-serif" fontSize="14" fontWeight="600">your forever</text>
      </g>
    </svg>
  );
}

