import { TestBed } from '@angular/core/testing';
import { PostComponent } from './post.component';

describe('PostComponent', () => {
  it('renders an accessible dialog and focuses the close button on open', async () => {
    await TestBed.configureTestingModule({
      imports: [PostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(PostComponent);
    fixture.componentInstance.post = {
      userId: 1,
      id: 1,
      title: 'first post',
      body: 'first body',
    };
    fixture.detectChanges();
    await fixture.whenStable();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const dialog = nativeElement.querySelector('[role="dialog"]');
    const closeButton = nativeElement.querySelector(
      '.close-button',
    ) as HTMLButtonElement;

    expect(dialog?.getAttribute('aria-modal')).toBe('true');
    expect(dialog?.getAttribute('aria-labelledby')).toBe('post-dialog-title');
    expect(dialog?.getAttribute('aria-describedby')).toBe('post-dialog-body');
    expect(document.activeElement).toBe(closeButton);
  });
});
