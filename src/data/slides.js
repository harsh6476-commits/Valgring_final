// slides.js — 20 slides for the Valgrind presentation (consolidated)

const slides = [
  // ===== SLIDE 1: TITLE =====
  {
    id: 1, module: 0, title: 'Title', type: 'title',
    grad: 'grad-hero',
    content: {
      kicker: 'GUEST LECTURE · SYSTEMS PROGRAMMING',
      title: 'Memory Debugging\nwith Valgrind',
      subtitle: 'Memory leaks, invalid memory access, Valgrind tools',
      team: "Havker's Party",
      members: ['Arihant Yadav', 'Achyut Mani', 'Harsh Prajapati', 'Om Rai'],
      terminal: {
        filename: 'terminal',
        label: 'REPRESENTATIVE — illustrative only',
        lines: [
          { prompt: true, text: './buggy_program' },
          { prompt: false, text: 'Segmentation fault (core dumped)' },
          { prompt: true, text: 'valgrind ./buggy_program' },
          { prompt: false, text: '==12345== Invalid write of size 4' },
          { prompt: false, text: '==12345==    at main (buggy.c:6)' },
        ],
      },
    },
  },

  // ===== SLIDE 2: WHY MEMORY DEBUGGING MATTERS =====
  {
    id: 2, module: 1, title: 'Why Memory Debugging Matters', type: 'concept',
    grad: 'grad-purple',
    content: {
      tag: '01 Foundations',
      heading: 'Why Memory Debugging Matters',
      bullets: [
        'Undefined behavior isn\'t guaranteed by the language — anything can happen',
        'Bugs can sit silently before symptoms appear in production',
        'Symptoms surface far from the faulty line of code',
        'Compilers don\'t catch most memory errors at build time',
      ],
      pullQuote: '"No crash does not mean no memory bug."',
    },
  },

  // ===== SLIDE 3: STACK vs HEAP =====
  {
    id: 3, module: 1, title: 'Stack vs Heap', type: 'concept',
    grad: 'grad-blue',
    content: {
      tag: '01 Foundations',
      heading: 'Stack vs Heap',
      layout: 'stack-heap',
      stack: { label: 'STACK (grows ↓)', items: ['main()', 'func()'], desc: 'LIFO — last in, first out' },
      heap: { label: 'HEAP (grows ↑)', items: ['malloc(32)', 'malloc(8) ← p', 'malloc(8)', 'malloc(20)'], desc: 'Dynamic allocation' },
      table: [
        { feature: 'Allocation', stack: 'Automatic', heap: 'Manual (malloc/free)' },
        { feature: 'Speed', stack: 'Fast', heap: 'Slower' },
        { feature: 'Lifetime', stack: 'Scope-bound', heap: 'Until free()' },
        { feature: 'Risk', stack: 'Stack overflow', heap: 'Leaks, dangling ptrs' },
      ],
    },
  },

  // ===== SLIDE 4: MEMORY ALLOCATION FUNCTIONS =====
  {
    id: 4, module: 1, title: 'Memory Allocation Functions', type: 'concept',
    grad: 'grad-green',
    content: {
      tag: '01 Foundations',
      heading: 'malloc / calloc / realloc / free',
      code: {
        filename: 'alloc.c',
        language: 'c',
        text: `int *p = malloc(5 * sizeof(int));  // 20 bytes, uninitialized`,
      },
      cards: [
        { name: 'malloc(size)', desc: 'Allocates size bytes. Contents are indeterminate (garbage values).', color: 'purple' },
        { name: 'calloc(n, size)', desc: 'Allocates n×size bytes. Memory is zeroed out.', color: 'green' },
        { name: 'realloc(ptr, size)', desc: 'Resizes a block. May move the block to a new address.', color: 'blue' },
        { name: 'free(ptr)', desc: 'Deallocates the block. Pointer becomes dangling.', color: 'red' },
      ],
      callout: 'malloc() does NOT initialize memory.',
    },
  },

  // ===== SLIDE 5: WHAT IS A MEMORY BUG? =====
  {
    id: 5, module: 1, title: 'What Is a Memory Bug?', type: 'concept',
    grad: 'grad-orange',
    content: {
      tag: '01 Foundations',
      heading: 'What Is a Memory Bug?',
      defCards: [
        { name: 'Memory Leak', desc: 'Allocated memory is never freed — it accumulates over time.', color: 'purple' },
        { name: 'Invalid Read/Write', desc: 'Accessing memory outside the bounds of an allocated block.', color: 'red' },
        { name: 'Use-After-Free', desc: 'Dereferencing a pointer after its block has been freed.', color: 'orange' },
        { name: 'Double-Free', desc: 'Calling free() on the same pointer more than once.', color: 'pink' },
        { name: 'Uninitialized Read', desc: 'Reading memory that was allocated but never written to.', color: 'blue' },
      ],
      footer: 'Each of these is undefined behavior — the next slides take them one at a time.',
    },
  },

  // ===== SLIDE 6: MEMORY LEAKS + Q2 =====
  {
    id: 6, module: 2, title: 'Memory Leaks', type: 'challenge',
    grad: 'grad-purple',
    content: {
      tag: 'LIVE CHALLENGE',
      badge: 'Q1',
      heading: 'Memory Leaks — Forgotten Deallocation',
      conceptNote: 'A memory leak happens when allocated memory is never freed. Leaks hit long-running processes hardest — servers slowly consume all available memory.',
      code: {
        filename: 'challenge_q1.c', language: 'c',
        text: `#include <stdlib.h>
#include <stdio.h>

int compute() {
    int *buffer = malloc(10 * sizeof(int));
    for (int i = 0; i < 10; i++) {
        buffer[i] = i * i;
    }
    int result = buffer[4];
    return result;   // What happens to buffer?
}

int main() {
    int val = compute();
    printf("Result: %d\\n", val);
    return 0;
}`,
      },
    },
  },

  // ===== SLIDE 7: INVALID READS & WRITES + Q1 =====
  {
    id: 7, module: 2, title: 'Invalid Reads & Writes', type: 'challenge',
    grad: 'grad-red',
    content: {
      tag: 'LIVE CHALLENGE',
      badge: 'Q2',
      heading: 'Invalid Reads & Writes — Off-by-One',
      conceptNote: 'Writing to arr[5] on a 5-element array is out-of-bounds access. Valid indexes are 0–4. Valgrind catches this even if the program doesn\'t crash.',
      code: {
        filename: 'challenge_q2.c', language: 'c',
        text: `#include <stdlib.h>

int main() {
    int n = 5;
    int *arr = malloc(n * sizeof(int));
    for (int i = 0; i <= n; i++) {  // Look carefully at this condition
        arr[i] = i * 10;
    }
    free(arr);
    return 0;
}`,
      },
      indexDiagram: { valid: [0, 1, 2, 3, 4], invalid: 5 },
    },
  },

  // ===== SLIDE 8: USE-AFTER-FREE + Q3 =====
  {
    id: 8, module: 2, title: 'Use-After-Free', type: 'challenge',
    grad: 'grad-orange',
    content: {
      tag: 'LIVE CHALLENGE',
      badge: 'Q3',
      heading: 'Use-After-Free — Dangling Pointer Write',
      conceptNote: 'free(p) doesn\'t erase the bytes — it marks the block as reusable. Dereferencing afterward is undefined behavior. The data might still "look valid" temporarily.',
      code: {
        filename: 'challenge_q3.c', language: 'c',
        text: `#include <stdlib.h>

int main() {
    int *p = malloc(sizeof(int));
    *p = 42;
    free(p);
    *p = 99;   // What does Valgrind say about this?
    return 0;
}`,
      },
    },
  },

  // ===== SLIDE 9: DOUBLE-FREE + Q4 =====
  {
    id: 9, module: 2, title: 'Double-Free', type: 'challenge',
    grad: 'grad-pink',
    content: {
      tag: 'LIVE CHALLENGE',
      badge: 'Q4',
      heading: 'Double-Free — Premature Heap Free',
      conceptNote: 'Calling free() twice on the same pointer corrupts allocator bookkeeping. Fix: set p = NULL after free — free(NULL) is a safe no-op.',
      code: {
        filename: 'challenge_q4.c', language: 'c',
        text: `#include <stdlib.h>

int main() {
    int *p = malloc(sizeof(int));
    *p = 100;
    for (int i = 0; i < 2; i++) {
        free(p);   // What happens on the second iteration?
    }
    return 0;
}`,
      },
    },
  },

  // ===== SLIDE 10: UNINITIALIZED + Q5 =====
  {
    id: 10, module: 2, title: 'Uninitialized Memory', type: 'challenge',
    grad: 'grad-blue',
    content: {
      tag: 'LIVE CHALLENGE',
      badge: 'Q5',
      heading: 'Uninitialized Memory — Branching on Garbage',
      conceptNote: 'malloc() does NOT zero-initialize bytes — they contain garbage. calloc() DOES zero-initialize. Reading uninitialized memory leads to unpredictable behavior.',
      code: {
        filename: 'challenge_q5.c', language: 'c',
        text: `#include <stdlib.h>
#include <stdio.h>

int main() {
    int *flag = malloc(sizeof(int));
    // Note: no value is written to *flag
    if (*flag == 1) {
        printf("Flag is set!\\n");
    } else {
        printf("Flag is not set.\\n");
    }
    free(flag);
    return 0;
}`,
      },
    },
  },

  // ===== SLIDE 11: WHAT IS VALGRIND + HOW IT WORKS =====
  {
    id: 11, module: 3, title: 'What Is Valgrind?', type: 'concept',
    grad: 'grad-purple',
    content: {
      tag: '03 Valgrind Internals',
      heading: 'What Is Valgrind?',
      bullets: [
        'Valgrind is a framework, not a single tool — it runs your program in a simulated CPU environment',
        'Ships several tools — this talk focuses on Memcheck',
        'The binary needs no recompilation, but instrumented runs are 10–50× slower',
      ],
      pipeline: [
        { label: 'C Source', sub: '.c file' },
        { label: 'Compile', sub: 'gcc -g' },
        { label: 'Executable', sub: 'a.out' },
        { label: 'Valgrind', sub: '+ Memcheck' },
        { label: 'Error Report', sub: 'output' },
      ],
      toolDiagram: {
        framework: 'VALGRIND',
        tools: [
          { name: 'Memcheck', highlight: true, desc: 'this talk' },
          { name: 'Helgrind', highlight: false },
          { name: 'Massif', highlight: false },
          { name: 'Cachegrind', highlight: false },
          { name: 'Callgrind', highlight: false },
        ],
      },
    },
  },

  // ===== SLIDE 12: MEMCHECK SHADOW MEMORY =====
  {
    id: 12, module: 3, title: 'How Memcheck Works', type: 'concept',
    grad: 'grad-green',
    content: {
      tag: '03 Valgrind Internals',
      heading: 'Shadow Memory & Detection',
      bullets: [
        'Intercepts every call to malloc, calloc, realloc, and free',
        'Maintains "shadow memory" — a parallel map tracking every byte\'s state',
      ],
      shadowMemory: {
        row1: { label: "YOUR PROGRAM'S MEMORY", cells: ['data', 'data', 'data', 'freed', '???'] },
        row2: { label: "MEMCHECK SHADOW", cells: ['A+V', 'A+V', 'A+V', 'NoA', 'NoV'] },
      },
      twoCol: {
        left: {
          title: 'ADDRESSABLE?',
          items: [
            { q: 'Inside a live block', a: '✓ Yes' },
            { q: 'Past the end of a block', a: '✗ No' },
            { q: 'After free()', a: '✗ No' },
          ],
        },
        right: {
          title: 'DEFINED?',
          items: [
            { q: 'Written by your program', a: '✓ Yes' },
            { q: 'Fresh malloc()', a: '✗ No' },
            { q: 'Fresh calloc()', a: '✓ Yes (zeroed)' },
          ],
        },
      },
    },
  },

  // ===== SLIDE 13: INSTALLING & COMMANDS =====
  {
    id: 13, module: 3, title: 'Using Valgrind', type: 'concept',
    grad: 'grad-blue',
    content: {
      tag: '03 Valgrind Internals',
      heading: 'Installing & Running Valgrind',
      code: {
        filename: 'terminal', language: 'bash',
        text: `$ sudo apt install valgrind
$ gcc -g program.c -o program
$ valgrind --leak-check=full ./program`,
      },
      comparison: {
        without: { label: 'WITHOUT -g', text: '==12345== at 0x40115A: ???' },
        with: { label: 'WITH -g', text: '==12345== at main (demo.c:6)' },
      },
      commandCards: [
        { cmd: 'valgrind ./program', desc: 'Basic run — detects critical errors' },
        { cmd: 'valgrind --leak-check=full ./program', desc: 'Full leak analysis with call stacks' },
        { cmd: 'valgrind --leak-check=full --show-leak-kinds=all ./program', desc: 'All leak categories' },
      ],
    },
  },

  // ===== SLIDE 14: DEMO 1 — MEMORY LEAK =====
  {
    id: 14, module: 4, title: 'Demo: Memory Leak', type: 'demo',
    grad: 'grad-purple',
    content: {
      tag: '04 Live Demo',
      heading: 'Demo — Memory Leak',
      prompt: 'Can you spot the bug before we run it?',
      code: {
        filename: 'demo1.c', language: 'c',
        text: `#include <stdlib.h>
#include <stdio.h>

int main() {
    int *arr = malloc(10 * sizeof(int));
    for (int i = 0; i < 10; i++) {
        arr[i] = i + 1;
    }
    printf("arr[0] = %d\\n", arr[0]);
    return 0;  
}`,
      },
      output: {
        filename: 'valgrind_output', language: 'text',
        text: `==12345== HEAP SUMMARY:
==12345==     in use at exit: 40 bytes in 1 blocks
==12345==   total heap usage: 1 allocs, 0 frees, 40 bytes allocated
==12345==
==12345== LEAK SUMMARY:
==12345==    definitely lost: 40 bytes in 1 blocks
==12345==    indirectly lost: 0 bytes in 0 blocks
==12345==      possibly lost: 0 bytes in 0 blocks
==12345==    still reachable: 0 bytes in 0 blocks`,
      },
      glossary: [
        { term: 'Definitely lost', def: 'No pointer to the block — truly leaked' },
        { term: 'Indirectly lost', def: 'Reachable only through a lost block' },
        { term: 'Possibly lost', def: 'Interior pointer exists — might be intentional' },
        { term: 'Still reachable', def: 'Pointer exists at exit — usually fine' },
      ],
      takeaway: 'Every malloc() needs exactly one matching free() — Valgrind only reports the problem, you still fix and re-verify.',
    },
  },

  // ===== SLIDE 15: DEMO 2 — INVALID WRITE =====
  {
    id: 15, module: 4, title: 'Demo: Invalid Write', type: 'demo',
    grad: 'grad-orange',
    content: {
      tag: '04 Live Demo',
      heading: 'Demo — Anatomy of a Valgrind Error',
      code: {
        filename: 'demo2.c', language: 'c',
        text: `#include <stdlib.h>

int main() {
    int *arr = malloc(5 * sizeof(int));
    arr[5] = 100;   // BUG: index 5 is out of bounds
    free(arr);
    return 0;
}`,
      },
      output: {
        filename: 'valgrind_output', language: 'text',
        text: `==12345== Invalid write of size 4
==12345==    at 0x40115A: main (demo2.c:5)
==12345==  Address 0x5205054 is 0 bytes after a block of size 20 alloc'd
==12345==    at 0x4C2FB0F: malloc (in /usr/lib/valgrind/...)
==12345==    by 0x40113E: main (demo2.c:4)`,
      },
      anatomy: [
        { num: '①', label: 'Error type', desc: 'Invalid write' },
        { num: '②', label: 'Access size', desc: '4 bytes (sizeof int)' },
        { num: '③', label: 'Source location', desc: 'main (demo2.c:5) — needs -g flag' },
        { num: '④', label: 'Address info', desc: '0 bytes after a block of size 20' },
        { num: '⑤', label: 'Allocation site', desc: 'malloc at main (demo2.c:4)' },
      ],
    },
  },

  // ===== SLIDE 16: ADVANCED Q6 + Q7 =====
  {
    id: 16, module: 5, title: 'Q6 & Q7', type: 'challenge-double',
    grad: 'grad-green',
    content: {
      tag: 'ADVANCED ROUND',
      heading: 'Advanced Challenges — Q6 & Q7',
      challenges: [
        {
          badge: 'Q6', title: 'Overwriting Pointer References',
          code: `char *str = malloc(16);\nstrcpy(str, "Hello, World!");\nstr = malloc(32);   // What happens to the first block?\nstrcpy(str, "Goodbye!");\nfree(str);`,
        },
        {
          badge: 'Q7', title: 'String Null-Terminator Overflow',
          code: `char *source = "Hello";\nchar *dest = malloc(strlen(source));\n// How many bytes is this?\nstrcpy(dest, source);\nfree(dest);`,
        },
      ],
    },
  },

  // ===== SLIDE 17: ADVANCED Q8 + Q9 + Q10 =====
  {
    id: 17, module: 5, title: 'Q8, Q9 & Q10', type: 'challenge-double',
    grad: 'grad-pink',
    content: {
      tag: 'ADVANCED ROUND',
      heading: 'Advanced Challenges — Q8, Q9 & Q10',
      challenges: [
        {
          badge: 'Q8', title: 'Incorrect Reallocation',
          code: `int *arr = malloc(5 * sizeof(int));\narr = realloc(arr, 1000000000 * sizeof(int));\n// realloc fails, returns NULL...\n// but where is the original block?`,
        },
        {
          badge: 'Q9', title: 'Linked List Teardown',
          code: `Node *head = malloc(sizeof(Node));\nhead->next = malloc(sizeof(Node));\nhead->next->next = NULL;\nfree(head);   // What about head->next?`,
        },
        {
          badge: 'Q10', title: 'Array of Pointers Mismatch',
          code: `int **matrix = malloc(3 * sizeof(int *));\nfor (int i = 0; i < 3; i++)\n    matrix[i] = malloc(4 * sizeof(int));\nfree(matrix);   // Is this enough?`,
        },
      ],
    },
  },

  // ===== SLIDE 18: BEYOND MEMCHECK + LIMITATIONS =====
  {
    id: 18, module: 6, title: 'Beyond Memcheck', type: 'concept',
    grad: 'grad-blue',
    content: {
      tag: '06 Recap',
      heading: 'Beyond Memcheck',
      questionCards: [
        { q: 'Leaking or corrupting memory?', a: 'Memcheck' },
        { q: 'Where is CPU time being spent?', a: 'Callgrind' },
        { q: 'What is the heap peak usage?', a: 'Massif' },
        { q: 'Is the cache being used well?', a: 'Cachegrind' },
        { q: 'Race conditions in threads?', a: 'Helgrind / DRD' },
      ],
      limitCards: [
        { title: 'Runtime Overhead', desc: '10–50× slower under instrumentation' },
        { title: 'Reports, Not Fixes', desc: 'You still have to fix the code yourself' },
        { title: 'Not All Bugs', desc: 'Some bugs need other tools or manual review' },
        { title: 'Not a Substitute', desc: 'Complements careful coding, doesn\'t replace it' },
      ],
    },
  },

  // ===== SLIDE 19: VALGRIND VS ASAN + RECAP =====
  {
    id: 19, module: 6, title: 'Recap', type: 'concept',
    grad: 'grad-green',
    content: {
      tag: '06 Recap',
      heading: 'Valgrind vs. ASan + Recap',
      vsTable: {
        headers: ['Feature', 'Valgrind', 'AddressSanitizer'],
        rows: [
          ['Binary', 'Runs unmodified binaries', 'Requires -fsanitize=address'],
          ['Speed', '10–50× slower', '~2× slower'],
          ['Setup', 'No recompilation needed', 'Compiler flag required'],
          ['Scope', 'Broad tool suite', 'Memory errors only'],
        ],
      },
      recapTable: {
        headers: ['Bug Type', 'Valgrind Report', 'Fix'],
        rows: [
          ['Memory Leak', 'definitely lost: N bytes', 'Add free() before scope exit'],
          ['Invalid R/W', 'Invalid write of size N', 'Check bounds, use < not <='],
          ['Use-After-Free', 'Invalid write ... block free\'d', 'Don\'t dereference after free()'],
          ['Double-Free', 'Invalid free()', 'Remove duplicate, set ptr = NULL'],
          ['Uninit Read', 'Conditional jump on uninit value', 'Initialize or use calloc()'],
        ],
      },
    },
  },

  // ===== SLIDE 20: CLOSING =====
  {
    id: 20, module: 6, title: 'Thank You', type: 'closing',
    grad: 'grad-hero',
    content: {
      heading: "Congratulations —\nyou've debugged your first heap.",
      team: "Havker's Party",
      members: ['Arihant Yadav', 'Achyut Mani', 'Harsh Prajapati', 'Om Rai'],
      terminal: {
        filename: 'next_steps.sh',
        lines: [
          '# Next Steps for Memory Mastery:',
          '# 1. Try AddressSanitizer: gcc -fsanitize=address -g prog.c',
          '# 2. Run valgrind on YOUR project code',
          '# 3. Use --track-origins=yes for uninitialized-value tracing',
          '',
          'echo "Keep debugging, keep building!"',
          'echo "— Havker\'s Party"',
        ],
      },
    },
  },
]

export const modules = [
  { id: 1, label: 'Foundations', slideRange: [2, 5] },
  { id: 2, label: 'Bug Types + Challenges', slideRange: [6, 10] },
  { id: 3, label: 'Valgrind Internals', slideRange: [11, 13] },
  { id: 4, label: 'Live Demos', slideRange: [14, 15] },
  { id: 5, label: 'Advanced Challenges', slideRange: [16, 17] },
  { id: 6, label: 'Recap & Closing', slideRange: [18, 20] },
]

export const quizQuestions = [
  {
    id: 'q1',
    question: 'What does Valgrind report when you write one element past the end of a heap array?',
    code: `int *arr = malloc(5 * sizeof(int));\nfor (int i = 0; i <= 5; i++) arr[i] = i * 10;`,
    options: [
      'A) Definitely lost: 20 bytes',
      'B) Invalid write of size 4',
      'C) Conditional jump on uninit value',
      'D) Invalid free()'
    ],
    correct: 1,
    explanation: 'Writing to arr[5] is 1 index beyond the 5-element allocation, triggering an Invalid write of size 4.'
  },
  {
    id: 'q2',
    question: 'A function mallocs a buffer and returns without freeing it. What does Valgrind report?',
    code: `int compute() {\n    int *buf = malloc(40);\n    return buf[4];\n}`,
    options: [
      'A) Invalid read of size 4',
      'B) definitely lost: 40 bytes in 1 blocks',
      'C) Invalid free()',
      'D) Use of uninitialised value'
    ],
    correct: 1,
    explanation: 'The pointer buf falls out of scope when compute() returns, permanently orphaning the 40-byte block.'
  },
  {
    id: 'q3',
    question: 'malloc → free → write to freed pointer. What kind of bug is this?',
    code: `int *p = malloc(4); *p = 42;\nfree(p); *p = 99;`,
    options: [
      'A) Memory Leak',
      'B) Double-Free',
      'C) Use-After-Free',
      'D) Uninitialized Read'
    ],
    correct: 2,
    explanation: 'Dereferencing p after calling free(p) is a Use-After-Free bug reported as an invalid write to a freed block.'
  },
  {
    id: 'q4',
    question: 'free() is called twice on the exact same pointer. Valgrind reports?',
    code: `int *p = malloc(4);\nfree(p); free(p);`,
    options: [
      'A) definitely lost: 4 bytes',
      'B) Invalid write of size 4',
      'C) Invalid free()',
      'D) Conditional jump on uninit value'
    ],
    correct: 2,
    explanation: 'Memcheck detects that the second free() call is deallocating an already-freed block and flags Invalid free().'
  },
  {
    id: 'q5',
    question: 'Branching on uninitialized malloc\'d memory. What does Valgrind warn?',
    code: `int *flag = malloc(sizeof(int));\nif (*flag == 1) printf("set!");`,
    options: [
      'A) Invalid read of size 4',
      'B) definitely lost',
      'C) Conditional jump depends on uninitialised value(s)',
      'D) Invalid write'
    ],
    correct: 2,
    explanation: 'malloc() leaves contents uninitialized. Using *flag in an if statement triggers a conditional jump on uninitialized value.'
  },
  {
    id: 'q6',
    question: 'Reassigning a pointer to a new malloc() without freeing the previous block?',
    code: `char *s = malloc(16);\ns = malloc(32); // old block?\nfree(s);`,
    options: [
      'A) Double-Free',
      'B) Use-After-Free',
      'C) Memory Leak — first block lost',
      'D) Invalid write'
    ],
    correct: 2,
    explanation: 'The address of the first 16-byte block is overwritten and lost forever, causing a definite memory leak.'
  },
  {
    id: 'q7',
    question: 'malloc(strlen(source)) used for strcpy destination. What is the bug?',
    code: `char *dest = malloc(strlen("Hello"));\nstrcpy(dest, "Hello");`,
    options: [
      'A) definitely lost: 5 bytes',
      'B) Invalid write of size 1 — missing null terminator space',
      'C) Conditional jump on uninit',
      'D) Invalid free()'
    ],
    correct: 1,
    explanation: 'strlen("Hello") is 5, but "Hello" requires 6 bytes including \\0. strcpy writes past the allocated buffer.'
  },
  {
    id: 'q8',
    question: 'If realloc() fails and returns NULL when directly assigned to the pointer?',
    code: `int *arr = malloc(20);\narr = realloc(arr, 999999999);`,
    options: [
      'A) Original block auto-freed',
      'B) Original block is lost — memory leak',
      'C) Invalid free()',
      'D) Immediate crash'
    ],
    correct: 1,
    explanation: 'If realloc() fails, it returns NULL without freeing the original buffer. Assigning directly to arr leaks the original memory.'
  },
  {
    id: 'q9',
    question: 'Calling free(head) in a linked list without first freeing head->next?',
    code: `Node *head = malloc(sizeof(Node));\nhead->next = malloc(sizeof(Node));\nfree(head);`,
    options: [
      'A) Invalid free()',
      'B) Only head->next leaked',
      'C) Both nodes lost (definitely + indirectly)',
      'D) No errors'
    ],
    correct: 1,
    explanation: 'Freeing head destroys the only pointer to head->next, permanently orphaning the child node (indirectly lost).'
  },
  {
    id: 'q10',
    question: 'Calling free(matrix) without freeing the individual dynamically allocated rows?',
    code: `int **m = malloc(3 * sizeof(int*));\nfor(int i=0;i<3;i++) m[i]=malloc(16);\nfree(m);`,
    options: [
      'A) All freed properly',
      'B) Row allocations orphaned/leaked',
      'C) Invalid free()',
      'D) Double-free'
    ],
    correct: 1,
    explanation: 'Freeing the row pointer array before freeing each m[i] row block orphans all the row buffers in heap memory.'
  },
]

export default slides
