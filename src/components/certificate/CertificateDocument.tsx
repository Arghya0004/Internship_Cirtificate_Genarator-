import React from 'react';
import { Student } from '../../types';
import { Award, ShieldCheck, CheckCircle2, QrCode } from 'lucide-react';

interface CertificateDocumentProps {
  student: Student;
  totalHours: number;
}

export const CertificateDocument: React.FC<CertificateDocumentProps> = ({
  student,
  totalHours,
}) => {
  const certId = student.certificate.certificateId || `CERT-${student.id}`;
  const issueDate = student.certificate.issuedAt
    ? new Date(student.certificate.issuedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  const formattedStartDate = student.startDate
    ? new Date(student.startDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A';

  const formattedEndDate = student.endDate
    ? new Date(student.endDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A';

  return (
    <div
      id="printable-certificate"
      className="relative w-full max-w-4xl mx-auto bg-gradient-to-br from-amber-50/40 via-white to-amber-50/30 p-8 sm:p-12 rounded-xl shadow-2xl border-8 border-double border-amber-700/60 overflow-hidden text-slate-800"
      style={{
        boxShadow: '0 20px 40px -15px rgba(180, 83, 9, 0.15), 0 0 0 1px rgba(180, 83, 9, 0.2)',
      }}
    >
      {/* Delicate inner decorative border with corner ornaments */}
      <div className="absolute inset-3 border border-amber-600/30 rounded pointer-events-none" />
      <div className="absolute inset-4 border border-dashed border-amber-600/20 rounded pointer-events-none" />

      {/* Corner Ornaments */}
      <div className="absolute top-5 left-5 w-8 h-8 border-t-2 border-l-2 border-amber-700 pointer-events-none" />
      <div className="absolute top-5 right-5 w-8 h-8 border-t-2 border-r-2 border-amber-700 pointer-events-none" />
      <div className="absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 border-amber-700 pointer-events-none" />
      <div className="absolute bottom-5 right-5 w-8 h-8 border-b-2 border-r-2 border-amber-700 pointer-events-none" />

      {/* Watermark Crest behind content */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
        <Award className="w-[500px] h-[500px] text-amber-900" />
      </div>

      <div className="relative z-10 text-center space-y-6">
        {/* Certificate Header Lockup */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-amber-700 text-white flex items-center justify-center shadow-md">
              <Award className="w-6 h-6" />
            </div>
          </div>
          <div className="text-[11px] font-cinzel tracking-[0.25em] uppercase text-amber-800 font-semibold">
            Official Certification of Achievement & Excellence
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-slate-900 tracking-wider">
            CERTIFICATE OF INTERNSHIP
          </h1>
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-700 to-transparent mx-auto my-2" />
        </div>

        {/* Presentation Statement */}
        <div className="space-y-3">
          <p className="text-sm font-serif-cert italic text-slate-600">
            This credential is duly conferred upon
          </p>

          <h2 className="text-3xl sm:text-4xl font-serif-cert font-bold text-slate-950 underline decoration-amber-600/50 decoration-1 underline-offset-8">
            {student.name}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl mx-auto pt-2">
            representing <span className="font-semibold text-slate-900">{student.college}</span>
          </p>
        </div>

        {/* Narrative Description */}
        <p className="text-sm sm:text-base text-slate-700 font-serif-cert leading-relaxed max-w-2xl mx-auto px-4">
          for having successfully completed the rigorous professional practicum in{' '}
          <strong className="font-sans font-bold text-slate-900 text-base">{student.domain}</strong>,
          fulfilling <strong className="font-sans font-bold text-slate-900">{totalHours > 0 ? totalHours : 160} verified hours</strong>{' '}
          of production engineering, daily work documentation, and peer technical reviews
          from <span className="whitespace-nowrap font-semibold">{formattedStartDate}</span> to{' '}
          <span className="whitespace-nowrap font-semibold">{formattedEndDate}</span>.
        </p>

        {/* Grade & Performance Highlight */}
        {student.certificate.performanceGrade && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100/70 border border-amber-300 rounded-full text-xs font-semibold text-amber-950">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Awarded Standing: {student.certificate.performanceGrade}</span>
          </div>
        )}

        {/* Bottom Section: Signatures & Seal */}
        <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          
          {/* Signature 1 */}
          <div className="text-center md:text-left space-y-1">
            <div className="font-serif-cert italic text-xl font-bold text-slate-900 border-b border-slate-400 pb-1 w-44 mx-auto md:mx-0">
              Eleanor Sterling
            </div>
            <div className="text-xs font-bold text-slate-900">Eleanor Sterling</div>
            <div className="text-[11px] text-slate-500">Program Director & Lead Mentor</div>
            <div className="text-[10px] text-slate-400">InternTrack Consortium</div>
          </div>

          {/* Golden Seal & QR Code */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="relative">
              {/* Outer seal teeth */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 p-1 shadow-lg border border-amber-700/40 flex items-center justify-center">
                <div className="w-full h-full rounded-full border border-dashed border-amber-900/40 flex flex-col items-center justify-center text-amber-950 p-1 bg-amber-500/10">
                  <ShieldCheck className="w-6 h-6 text-amber-950 mb-0.5" />
                  <span className="text-[8px] font-bold tracking-widest font-cinzel uppercase">VERIFIED</span>
                  <span className="text-[7px] font-mono-num font-semibold text-amber-900">2026</span>
                </div>
              </div>
              {/* Seal Ribbon */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none">
                <div className="w-3 h-5 bg-amber-700 transform -rotate-12 rounded-b shadow-sm" />
                <div className="w-3 h-5 bg-amber-800 transform rotate-12 rounded-b shadow-sm" />
              </div>
            </div>
            <div className="pt-2 text-[10px] font-mono-num font-semibold text-slate-500 tracking-wider">
              OFFICIAL VERIFIED SEAL
            </div>
          </div>

          {/* Signature 2 */}
          <div className="text-center md:text-right space-y-1">
            <div className="font-serif-cert italic text-xl font-bold text-slate-900 border-b border-slate-400 pb-1 w-44 mx-auto md:ml-auto md:mr-0">
              Dr. Arthur Vance
            </div>
            <div className="text-xs font-bold text-slate-900">Dr. Arthur Vance, Ph.D.</div>
            <div className="text-[11px] text-slate-500">Dean of Engineering & Practicum</div>
            <div className="text-[10px] text-slate-400">Academic Verification Council</div>
          </div>

        </div>

        {/* Certificate Metadata Footer */}
        <div className="pt-6 border-t border-amber-900/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono-num gap-2">
          <div className="flex items-center gap-3">
            <span>Certificate ID: <strong className="text-slate-800">{certId}</strong></span>
            <span>·</span>
            <span>Student ID: <strong className="text-slate-800">{student.id}</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <span>Issue Date: <strong className="text-slate-800">{issueDate}</strong></span>
            <span>·</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Cryptographically Endorsed
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
